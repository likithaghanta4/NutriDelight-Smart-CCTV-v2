"""Shared configuration values and detection class mappings."""

from __future__ import annotations

import os
import sys
from pathlib import Path
from dataclasses import dataclass, field


def get_project_root() -> Path:
    """
    Returns the correct directory whether running
    from Python or from the packaged EXE.
    """
    if getattr(sys, "frozen", False):
        return Path(sys.executable).parent

    return Path(__file__).resolve().parent.parent

COCO_CLASS_IDS = {
    0: "person",
    2: "car",
    3: "motorcycle",
    5: "bus",
    7: "truck",
}

TARGET_CLASS_IDS = tuple(COCO_CLASS_IDS.keys())
TARGET_CLASS_NAMES = tuple(COCO_CLASS_IDS.values())


@dataclass(slots=True)
class AppSettings:
    """Runtime settings for the AI Engine."""

    source: str = "webcam"
    model_path: str = str(get_project_root() / "yolo11n.pt")
    confidence_threshold: float = 0.35
    iou_threshold: float = 0.45
    window_name: str = "NutriDelight Smart CCTV Analytics"
    frame_width: int = 1280
    frame_height: int = 720
    max_fps: int = 30
    backend_detections_url: str = os.getenv("BACKEND_DETECTIONS_URL",  "https://nutridelight-backend.onrender.com/api/detections"
)
    backend_timeout_seconds: float = float(os.getenv("BACKEND_TIMEOUT_SECONDS", "2.0"))
    backend_post_interval_seconds: float = float(os.getenv("BACKEND_POST_INTERVAL_SECONDS", "10.0"))
    camera_name: str | None = os.getenv("CAMERA_NAME")
    status_messages: list[str] = field(default_factory=list)
