"""Helpers for resolving the user-provided video source."""

from __future__ import annotations

from pathlib import Path


def resolve_source(source: str) -> int | str:
    """Resolve webcam aliases, file paths, and RTSP URLs into an OpenCV-friendly source."""

    normalized = source.strip()

    if normalized.lower() in {"webcam", "camera", "default"}:
        return 0

    if normalized.isdigit():
        return int(normalized)

    path = Path(normalized)
    if path.exists():
        return str(path)

    return normalized
