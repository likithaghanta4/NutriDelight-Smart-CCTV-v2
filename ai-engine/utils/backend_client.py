"""HTTP client for sending live detection counts to the Node backend."""

from __future__ import annotations

import json
from collections import Counter
from datetime import datetime
from urllib import error, request

from config.settings import TARGET_CLASS_NAMES


class DetectionBackendClient:
    """Send live detection counts to the backend API."""

    def __init__(self, endpoint_url: str, timeout_seconds: float = 2.0) -> None:
        self.endpoint_url = endpoint_url
        self.timeout_seconds = timeout_seconds

    def build_payload(
        self,
        counts: Counter[str],
        camera_name: str,
        timestamp: str | None = None,
        total_visitors: int = 0,
        current_inside: int = 0,
        entries: int = 0,
        exits: int = 0,
    ) -> dict[str, int | str]:
        """Build the JSON payload expected by the backend."""

        payload: dict[str, int | str] = {
            class_name: int(counts.get(class_name, 0)) for class_name in TARGET_CLASS_NAMES
        }
        payload["camera"] = camera_name
        payload["timestamp"] = timestamp or datetime.utcnow().replace(microsecond=0).isoformat()
        payload["total_visitors"] = int(total_visitors)

        payload["current_inside"] = int(current_inside)
        payload["entries"] = int(entries)
        payload["exits"] = int(exits)
        return payload

    def post_payload(self, payload: dict[str, int | str]) -> None:
        """POST the detection payload to the backend."""

        body = json.dumps(payload).encode("utf-8")
        http_request = request.Request(
            self.endpoint_url,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with request.urlopen(http_request, timeout=self.timeout_seconds) as response:
                response.read()
                if response.status >= 400:
                    raise RuntimeError(f"Backend returned HTTP {response.status}")
        except error.HTTPError as exc:
            raise RuntimeError(f"Backend returned HTTP {exc.code}") from exc
        except error.URLError as exc:
            raise RuntimeError(f"Unable to reach backend at {self.endpoint_url}: {exc.reason}") from exc

    def get_today_statistics(self) -> dict:
        """Fetch today's statistics from the backend."""

        url = self.endpoint_url.replace(
            "/detections",
            "/daily-statistics",
        )

        try:
            with request.urlopen(url, timeout=self.timeout_seconds) as response:
                return json.loads(response.read().decode("utf-8"))
        except Exception:
            return {}