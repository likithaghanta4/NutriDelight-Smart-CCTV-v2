"""Threaded video source reader for webcams, files, and RTSP streams."""

from __future__ import annotations

import threading
import time

import cv2
import numpy as np

from utils.errors import VideoSourceError
from utils.source_utils import resolve_source


class VideoSource:
    """Continuously grabs the most recent frame from a video source."""

    def __init__(self, source: str) -> None:
        self.source = source
        self._resolved_source = resolve_source(source)
        self._capture: cv2.VideoCapture | None = None
        self._thread: threading.Thread | None = None
        self._lock = threading.Lock()
        self._running = False
        self._ended = False
        self._frame: np.ndarray | None = None
        self._frame_index = 0
        self._last_error: str | None = None

    @property
    def last_error(self) -> str | None:
        """Return the latest source error message, if any."""

        return self._last_error

    def start(self) -> "VideoSource":
        """Open the capture device and start the background reader."""

        backend = cv2.CAP_DSHOW if isinstance(self._resolved_source, int) else cv2.CAP_FFMPEG
        capture = cv2.VideoCapture(self._resolved_source, backend)
        if not capture.isOpened() and backend != cv2.CAP_FFMPEG:
            capture = cv2.VideoCapture(self._resolved_source)

        if not capture.isOpened():
            raise VideoSourceError(
                f"Unable to open video source '{self.source}'. Check the webcam, file path, or RTSP URL."
            )

        capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        self._capture = capture
        self._running = True
        self._ended = False
        self._thread = threading.Thread(target=self._reader_loop, daemon=True)
        self._thread.start()
        return self

    def _reader_loop(self) -> None:
        """Continuously read the freshest frame from the source."""

        assert self._capture is not None

        while self._running:
            ok, frame = self._capture.read()
            if not ok:
                self._last_error = (
                    f"Video source '{self.source}' stopped delivering frames. "
                    "If this is a file, playback has ended. If this is RTSP, the camera may be offline."
                )
                self._ended = True
                self._running = False
                break

            with self._lock:
                self._frame = frame
                self._frame_index += 1

            time.sleep(0.001)

    def read(self, last_frame_index: int) -> tuple[np.ndarray | None, int, bool]:
        """Return the newest frame, its index, and whether the stream has ended."""

        with self._lock:
            if self._frame is None:
                return None, last_frame_index, self._ended

            if self._frame_index == last_frame_index:
                return None, last_frame_index, self._ended

            return self._frame.copy(), self._frame_index, self._ended

    def release(self) -> None:
        """Stop the reader and release the capture object."""

        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=1.0)

        if self._capture is not None:
            self._capture.release()
