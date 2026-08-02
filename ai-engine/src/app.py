"""Orchestrates the live CCTV analytics loop."""

from __future__ import annotations

from collections import Counter
from datetime import datetime
import time

import cv2
import numpy as np

from config.settings import AppSettings, TARGET_CLASS_NAMES
from src.detector import YOLOv11Detector
from src.visitor_tracking import VisitorTrackingState
from src.video_source import VideoSource
from utils.backend_client import DetectionBackendClient
from utils.performance import FPSCounter
from utils.visualization import draw_detections
from src.stream.video_stream import set_frame, start_stream_server


class CCTVAnalyticsApp:
    """End-to-end live analytics application."""

    def __init__(self, settings: AppSettings) -> None:
        self.settings = settings

        self.detector = YOLOv11Detector(
            model_path=settings.model_path,
            confidence_threshold=settings.confidence_threshold,
            iou_threshold=settings.iou_threshold,
        )

        self.backend_client = DetectionBackendClient(
            endpoint_url=settings.backend_detections_url,
            timeout_seconds=settings.backend_timeout_seconds,
        )

        self.fps_counter = FPSCounter()
        self.visitor_state = VisitorTrackingState()

        # Load today's statistics from backend
        today_stats = self.backend_client.get_today_statistics()

        if today_stats:
            print(f"[AI][bootstrap] loaded today_stats={today_stats}")
            self.visitor_state.total_visitors = today_stats.get("total_visitors", 0)
            self.visitor_state.entries = today_stats.get("entries", 0)
            self.visitor_state.exits = today_stats.get("exits", 0)
            self.visitor_state.current_inside = max(self.visitor_state.entries - self.visitor_state.exits, 0)

    def run(self) -> None:
        """Start the capture, inferencing, and display loop."""
        """Start the capture, inferencing, and display loop."""  



    
        cv2.setUseOptimized(True)
        start_stream_server()
        source = VideoSource(self.settings.source)
        try:
            source.start()
        except Exception as exc:
            raise RuntimeError(str(exc)) from exc

        window_name = self.settings.window_name
        cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(window_name, self.settings.frame_width, self.settings.frame_height)

        last_frame_index = -1
        last_backend_post_at = 0.0
        last_payload_signature: tuple[int, ...] | None = None
        last_visitor_signature: tuple[int, int, int, int] | None = None

        try:
            while True:
                frame, last_frame_index, ended = source.read(last_frame_index)
                if frame is None:
                    if ended:
                        message = source.last_error or "Video source ended."
                        print(message)
                        break

                    key = cv2.waitKey(1) & 0xFF
                    if key in (ord("q"), 27):
                        break
                    time.sleep(0.005)
                    continue

                try:
                    detections = self.detector.track(frame)
                except Exception as exc:
                    print(f"Frame inference failed: {exc}")
                    detections = []

                if self.visitor_state.line_y is None:
                    self.visitor_state.line_y = frame.shape[0] // 2

                self.visitor_state.update(detections)

                counts = Counter(detection.class_name for detection in detections)
                counts_signature = tuple(counts.get(class_name, 0) for class_name in TARGET_CLASS_NAMES)
                visitor_signature = (
                    self.visitor_state.total_visitors,
                    self.visitor_state.current_inside,
                    self.visitor_state.entries,
                    self.visitor_state.exits,
                )
                payload = self.backend_client.build_payload(
                    counts=counts,
                    camera_name=self.settings.camera_name or self.settings.source,
                    timestamp=datetime.utcnow().replace(microsecond=0).isoformat(),
                    total_visitors=self.visitor_state.total_visitors,
                    current_inside=self.visitor_state.current_inside,
                    entries=self.visitor_state.entries,
                    exits=self.visitor_state.exits,
                )
                print(f"[AI][payload] {payload}")

                now = time.monotonic()
                should_post = (
                    now - last_backend_post_at >= self.settings.backend_post_interval_seconds
                    or counts_signature != last_payload_signature
                    or visitor_signature != last_visitor_signature
                )
                if should_post:
                    try:
                        self.backend_client.post_payload(payload)
                        last_backend_post_at = now
                        last_payload_signature = counts_signature
                        last_visitor_signature = visitor_signature
                    except Exception as exc:
                        print(f"Failed to send detections to backend: {exc}")

                fps = self.fps_counter.tick()
                annotated = draw_detections(
                    frame=frame,
                    detections=detections,
                    fps=fps,
                    source_name=self.settings.source,
                    visitor_state=self.visitor_state,
                )
                set_frame(annotated)
                cv2.imshow(window_name, annotated)

                key = cv2.waitKey(1) & 0xFF
                if key in (ord("q"), 27):
                    break
        finally:
            source.release()
            cv2.destroyAllWindows()
