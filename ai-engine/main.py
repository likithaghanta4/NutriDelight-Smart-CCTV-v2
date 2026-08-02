"""CLI entry point for the NutriDelight Smart CCTV Analytics AI Engine."""

from __future__ import annotations

import argparse
import sys

from config.settings import AppSettings
from src.app import CCTVAnalyticsApp


def build_parser() -> argparse.ArgumentParser:
    """Build the command-line interface for the AI Engine."""

    parser = argparse.ArgumentParser(
        description="NutriDelight Smart CCTV Analytics AI Engine",
    )
    parser.add_argument(
        "--source",
        default="webcam",
        help='Video source: "webcam", local file path, or RTSP URL.',
    )
    parser.add_argument(
        "--model",
        default=AppSettings().model_path,
        help="Path to a local YOLOv11 weight file or a Ultralytics model name.",
    )
    parser.add_argument(
        "--confidence",
        type=float,
        default=AppSettings().confidence_threshold,
        help="Minimum confidence threshold for detections.",
    )
    parser.add_argument(
        "--iou",
        type=float,
        default=AppSettings().iou_threshold,
        help="IOU threshold used by non-max suppression.",
    )
    parser.add_argument(
        "--window-name",
        default=AppSettings().window_name,
        help="OpenCV window title.",
    )
    parser.add_argument(
        "--backend-url",
        default=AppSettings().backend_detections_url,
        help="Node backend endpoint for live detection counts.",
    )
    parser.add_argument(
        "--backend-timeout",
        type=float,
        default=AppSettings().backend_timeout_seconds,
        help="Timeout in seconds for sending detection counts to the backend.",
    )
    parser.add_argument(
        "--backend-post-interval",
        type=float,
        default=AppSettings().backend_post_interval_seconds,
        help="Minimum interval in seconds between backend posts.",
    )
    parser.add_argument(
        "--camera-name",
        default=AppSettings().camera_name,
        help="Camera label sent with detection payloads.",
    )
    return parser


def main() -> int:
    """Run the AI Engine and return a process exit code."""

    parser = build_parser()
    args = parser.parse_args()

    settings = AppSettings(
        source=args.source,
        model_path=args.model,
        confidence_threshold=args.confidence,
        iou_threshold=args.iou,
        window_name=args.window_name,
        backend_detections_url=args.backend_url,
        backend_timeout_seconds=args.backend_timeout,
        backend_post_interval_seconds=args.backend_post_interval,
        camera_name=args.camera_name,
    )

    engine = CCTVAnalyticsApp(settings=settings)

    try:
        engine.run()
        return 0
    except KeyboardInterrupt:
        print("\nShutting down NutriDelight Smart CCTV Analytics AI Engine.")
        return 0
    except Exception as exc:  # pragma: no cover - top-level safeguard
        print(f"AI Engine failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
