"""Performance helpers used by the live analytics loop."""

from __future__ import annotations

import time


class FPSCounter:
    """Track a moving average FPS for the live preview."""

    def __init__(self) -> None:
        self._last_time = time.perf_counter()
        self._fps = 0.0

    def tick(self) -> float:
        """Update the FPS meter and return the current smoothed FPS value."""

        now = time.perf_counter()
        delta = now - self._last_time
        self._last_time = now

        if delta > 0:
            instant_fps = 1.0 / delta
            self._fps = instant_fps if self._fps == 0.0 else (self._fps * 0.9) + (instant_fps * 0.1)

        return self._fps
