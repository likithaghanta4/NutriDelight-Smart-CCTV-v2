"""YOLOv11 tracking wrapper for people and vehicle analytics."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from ultralytics import YOLO

from config.settings import COCO_CLASS_IDS, TARGET_CLASS_IDS
from utils.errors import ModelLoadError


@dataclass(slots=True)
class Detection:
    """A single tracked detection returned by YOLOv11."""

    track_id: int | None
    class_name: str
    confidence: float
    bbox: tuple[int, int, int, int]


class YOLOv11Detector:
    """Loads a YOLOv11 model once and reuses it for frame-by-frame tracking."""

    def __init__(
        self,
        model_path: str,
        confidence_threshold: float = 0.35,
        iou_threshold: float = 0.45,
        device: str | None = None,
    ) -> None:
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self.iou_threshold = iou_threshold
        self.device = device
        self.model = self._load_model(model_path)

    def _load_model(self, model_path: str) -> YOLO:
        try:
            model = YOLO(model_path)
            return model
        except Exception as exc:  # pragma: no cover - ultralytics runtime path
            raise ModelLoadError(f"Unable to load YOLOv11 model '{model_path}': {exc}") from exc

    def track(self, frame: np.ndarray) -> list[Detection]:
        """Run object tracking on a single frame using ByteTrack."""

        results = self.model.track(
            source=frame,
            conf=self.confidence_threshold,
            iou=self.iou_threshold,
            classes=list(TARGET_CLASS_IDS),
            device=self.device,
            tracker="bytetrack.yaml",
            persist=True,
            verbose=False,
        )

        detections: list[Detection] = []
        if not results:
            return detections

        for result in results:
            names = result.names
            boxes = result.boxes
            if boxes is None:
                continue

            for box in boxes:
                class_id = int(box.cls.item())
                class_name = names.get(class_id, COCO_CLASS_IDS.get(class_id, "object"))
                if class_id not in COCO_CLASS_IDS:
                    continue

                confidence = float(box.conf.item())
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                track_id = int(box.id.item()) if box.id is not None else None
                detections.append(
                    Detection(
                        track_id=track_id,
                        class_name=class_name,
                        confidence=confidence,
                        bbox=(int(x1), int(y1), int(x2), int(y2)),
                    )
                )

        return detections
