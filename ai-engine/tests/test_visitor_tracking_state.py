from __future__ import annotations

import sys
from pathlib import Path
import unittest

AI_ENGINE_ROOT = Path(__file__).resolve().parents[1]
if str(AI_ENGINE_ROOT) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_ROOT))

from src.visitor_tracking import VisitorTrackingState  # noqa: E402


class DetectionStub:
    def __init__(self, class_name: str, track_id: int | None, bbox: tuple[int, int, int, int]) -> None:
        self.class_name = class_name
        self.track_id = track_id
        self.bbox = bbox


def person_detection(track_id: int, center_y: int) -> DetectionStub:
    return DetectionStub(
        class_name="person",
        track_id=track_id,
        bbox=(0, center_y - 10, 10, center_y + 10),
    )


class VisitorTrackingStateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.state = VisitorTrackingState(line_y=100)

    def assert_consistent(self) -> None:
        self.assertGreaterEqual(self.state.total_visitors, 0)
        self.assertGreaterEqual(self.state.current_inside, 0)
        self.assertGreaterEqual(self.state.entries, 0)
        self.assertGreaterEqual(self.state.exits, 0)
        self.assertLessEqual(self.state.exits, self.state.entries)
        self.assertLessEqual(self.state.total_visitors, self.state.entries)
        self.assertEqual(self.state.current_inside, self.state.entries - self.state.exits)

    def test_entry_exit_reentry_stays_consistent(self) -> None:
        self.state.update([person_detection(1, 150)])
        self.assert_consistent()

        self.state.update([person_detection(1, 90)])
        self.assertEqual(self.state.entries, 1)
        self.assertEqual(self.state.exits, 0)
        self.assertEqual(self.state.current_inside, 1)
        self.assertEqual(self.state.total_visitors, 1)
        self.assert_consistent()

        self.state.update([person_detection(1, 150)])
        self.assertEqual(self.state.entries, 1)
        self.assertEqual(self.state.exits, 1)
        self.assertEqual(self.state.current_inside, 0)
        self.assertEqual(self.state.total_visitors, 1)
        self.assert_consistent()

        self.state.update([person_detection(1, 90)])
        self.assertEqual(self.state.entries, 2)
        self.assertEqual(self.state.exits, 1)
        self.assertEqual(self.state.current_inside, 1)
        self.assertEqual(self.state.total_visitors, 1)
        self.assert_consistent()

    def test_multiple_crossings_across_two_people(self) -> None:
        self.state.update([person_detection(1, 150), person_detection(2, 160)])
        self.assert_consistent()

        self.state.update([person_detection(1, 90), person_detection(2, 80)])
        self.assertEqual(self.state.entries, 2)
        self.assertEqual(self.state.exits, 0)
        self.assertEqual(self.state.current_inside, 2)
        self.assertEqual(self.state.total_visitors, 2)
        self.assert_consistent()

        self.state.update([person_detection(1, 150), person_detection(2, 80)])
        self.assertEqual(self.state.entries, 2)
        self.assertEqual(self.state.exits, 1)
        self.assertEqual(self.state.current_inside, 1)
        self.assertEqual(self.state.total_visitors, 2)
        self.assert_consistent()

        self.state.update([person_detection(1, 150), person_detection(2, 160)])
        self.assertEqual(self.state.entries, 2)
        self.assertEqual(self.state.exits, 2)
        self.assertEqual(self.state.current_inside, 0)
        self.assertEqual(self.state.total_visitors, 2)
        self.assert_consistent()

    def test_does_not_count_without_line_crossing(self) -> None:
        self.state.update([person_detection(1, 150)])
        self.state.update([person_detection(1, 140)])
        self.state.update([person_detection(1, 130)])
        self.assertEqual(self.state.entries, 0)
        self.assertEqual(self.state.exits, 0)
        self.assertEqual(self.state.current_inside, 0)
        self.assertEqual(self.state.total_visitors, 0)
        self.assert_consistent()

    def test_initial_state_matches_first_sighting_side(self) -> None:
        self.state.update([person_detection(1, 150)])
        self.assertEqual(self.state.line_position_by_id[1], 150.0)

        other_state = VisitorTrackingState(line_y=100)
        other_state.update([person_detection(2, 150)])
        other_state.update([person_detection(2, 80)])
        self.assertEqual(other_state.person_state[2], "inside")

        self.assert_consistent()

    def test_standing_near_line_does_not_trigger_counts(self) -> None:
        for timestamp in range(5):
            self.state.update([person_detection(1, 101)])

        self.assertEqual(self.state.entries, 0)
        self.assertEqual(self.state.exits, 0)
        self.assertEqual(self.state.current_inside, 0)
        self.assertEqual(self.state.total_visitors, 0)
        self.assert_consistent()

    def test_temporary_occlusion_keeps_track_state(self) -> None:
        self.state.update([person_detection(7, 150)])
        self.state.update([person_detection(7, 90)])
        self.state.update([])
        self.state.update([])
        self.state.update([person_detection(7, 90)])

        self.assertEqual(self.state.entries, 1)
        self.assertEqual(self.state.exits, 0)
        self.assertEqual(self.state.current_inside, 1)
        self.assertEqual(self.state.total_visitors, 1)
        self.assert_consistent()

    def test_multiple_people_entering_simultaneously(self) -> None:
        self.state.update([person_detection(1, 150), person_detection(2, 160)])
        self.state.update([person_detection(1, 90), person_detection(2, 80)])

        self.assertEqual(self.state.entries, 2)
        self.assertEqual(self.state.exits, 0)
        self.assertEqual(self.state.current_inside, 2)
        self.assertEqual(self.state.total_visitors, 2)
        self.assert_consistent()

    def test_reentry_does_not_double_count_same_track(self) -> None:
        self.state.update([person_detection(1, 150)])
        self.state.update([person_detection(1, 90)])
        self.state.update([person_detection(1, 150)])
        self.state.update([person_detection(1, 90)])

        self.assertEqual(self.state.entries, 2)
        self.assertEqual(self.state.exits, 1)
        self.assertEqual(self.state.current_inside, 1)
        self.assertEqual(self.state.total_visitors, 1)
        self.assert_consistent()


if __name__ == "__main__":
    unittest.main()
