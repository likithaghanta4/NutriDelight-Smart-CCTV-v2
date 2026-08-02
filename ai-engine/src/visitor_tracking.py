"""Visitor line-crossing tracking for live CCTV analytics."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class VisitorTrackingState:
    """Track unique people crossing the counting line."""

    line_y: int | None = None
    line_position_by_id: dict[int, float] = field(default_factory=dict)
    person_state: dict[int, str] = field(default_factory=dict)
    counted_track_ids: set[int] = field(default_factory=set)
    total_visitors: int = 0
    current_inside: int = 0
    entries: int = 0
    exits: int = 0

    def update(self, detections: list) -> None:
        person_detections = [
            detection
            for detection in detections
            if detection.class_name == "person" and detection.track_id is not None
        ]

        if self.line_y is None:
            return

        seen_track_ids: set[int] = set()

        for detection in person_detections:
            track_id = int(detection.track_id)
            seen_track_ids.add(track_id)

            x1, y1, x2, y2 = detection.bbox
            center_y = (y1 + y2) / 2.0
            print(f"Line Y = {self.line_y}, Feet Y = {center_y}")

            previous_y = self.line_position_by_id.get(track_id)
            self.line_position_by_id[track_id] = center_y

            if previous_y is None:
                continue

            if previous_y > self.line_y and center_y <= self.line_y:
                state = self.person_state.get(track_id, "outside")

                if state == "outside":
                    self.entries += 1
                    self.person_state[track_id] = "inside"

                    if track_id not in self.counted_track_ids:
                        self.total_visitors += 1
                        self.counted_track_ids.add(track_id)

                    self.current_inside = max(0, self.entries - self.exits)
                    print("ENTRY COUNTED")

            elif previous_y < self.line_y and center_y >= self.line_y:
                state = self.person_state.get(track_id, "inside")

                if state == "inside":
                    self.exits += 1
                    self.current_inside = max(0, self.entries - self.exits)

                    self.person_state[track_id] = "outside"

                    print("EXIT COUNTED")

        stale_track_ids = set(self.line_position_by_id) - seen_track_ids

        for track_id in stale_track_ids:
            self.line_position_by_id.pop(track_id, None)
            self.person_state.pop(track_id, None)
