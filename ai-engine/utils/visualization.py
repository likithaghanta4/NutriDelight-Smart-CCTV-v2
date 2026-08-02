"""Frame drawing helpers for boxes, labels, counts, and status overlays."""

from __future__ import annotations

from collections import Counter

import cv2
import numpy as np

from config.settings import TARGET_CLASS_NAMES
from src.detector import Detection


def _format_track_label(detection: Detection) -> str:
    base_label = f"{detection.class_name} {detection.confidence:.2f}"
    if detection.track_id is None:
        return base_label
    return f"{base_label} ID:{detection.track_id}"


def _color_for_label(label: str) -> tuple[int, int, int]:
    """Create a stable BGR color from the class label."""

    palette = {
        "person": (40, 220, 40),
        "car": (255, 140, 0),
        "motorcycle": (0, 180, 255),
        "bus": (255, 80, 80),
        "truck": (180, 80, 255),
    }
    return palette.get(label, (200, 200, 200))


def draw_detections(
    frame: np.ndarray,
    detections: list[Detection],
    fps: float,
    source_name: str,
    visitor_state,
) -> np.ndarray:
    """Overlay detections, live counts, and runtime information onto a frame."""

    output = frame.copy()
    counts = Counter(detection.class_name for detection in detections)
    line_y = visitor_state.line_y if visitor_state.line_y is not None else output.shape[0] // 2

    for detection in detections:
        x1, y1, x2, y2 = detection.bbox
        color = _color_for_label(detection.class_name)

        cv2.rectangle(output, (x1, y1), (x2, y2), color, 2)
        label = _format_track_label(detection)
        text_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        text_w, text_h = text_size
        text_origin = (x1, max(25, y1 - 8))

        cv2.rectangle(
            output,
            (text_origin[0], text_origin[1] - text_h - 8),
            (text_origin[0] + text_w + 8, text_origin[1] + 4),
            color,
            -1,
        )
        cv2.putText(
            output,
            label,
            (text_origin[0] + 4, text_origin[1]),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 0, 0),
            2,
            cv2.LINE_AA,
        )

    cv2.line(output, (0, line_y), (output.shape[1], line_y), (0, 255, 255), 2)

    overlay = output.copy()
    panel_height = 190 + (22 * len(TARGET_CLASS_NAMES))
    cv2.rectangle(overlay, (10, 10), (420, panel_height), (0, 0, 0), -1)
    output = cv2.addWeighted(overlay, 0.35, output, 0.65, 0)

    cv2.putText(output, "NutriDelight Smart CCTV Analytics", (24, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(output, f"Source: {source_name}", (24, 66), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (230, 230, 230), 1, cv2.LINE_AA)
    cv2.putText(output, f"FPS: {fps:.1f}", (24, 92), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (230, 230, 230), 1, cv2.LINE_AA)
    cv2.putText(output, f"Total Visitors: {visitor_state.total_visitors}", (24, 118), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (255, 255, 255), 1, cv2.LINE_AA)
    cv2.putText(output, f"Current Inside: {visitor_state.current_inside}", (24, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (255, 255, 255), 1, cv2.LINE_AA)
    cv2.putText(output, f"Entries: {visitor_state.entries}", (24, 162), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (255, 255, 255), 1, cv2.LINE_AA)
    cv2.putText(output, f"Exits: {visitor_state.exits}", (24, 184), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (255, 255, 255), 1, cv2.LINE_AA)

    y = 214
    for class_name in TARGET_CLASS_NAMES:
        cv2.putText(
            output,
            f"{class_name.title()}: {counts.get(class_name, 0)}",
            (24, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (255, 255, 255),
            1,
            cv2.LINE_AA,
        )
        y += 22

    return output
