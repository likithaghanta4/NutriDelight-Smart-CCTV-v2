"""Project-specific exception types."""


class AIEngineError(Exception):
    """Base error for the AI Engine."""


class VideoSourceError(AIEngineError):
    """Raised when the video source cannot be opened or read."""


class ModelLoadError(AIEngineError):
    """Raised when the YOLO model cannot be loaded."""


class DetectionError(AIEngineError):
    """Raised when frame inference fails."""
