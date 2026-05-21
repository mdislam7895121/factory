from __future__ import annotations
import json
from typing import Any
import urllib.request
import urllib.error

from .types import PerpetualError

DEFAULT_BASE_URL = "https://api.perpetual.dev"
DEFAULT_TIMEOUT = 30


class HttpClient:
    def __init__(self, api_key: str, base_url: str = DEFAULT_BASE_URL, timeout: int = DEFAULT_TIMEOUT) -> None:
        if not api_key.startswith("sk-live-"):
            raise ValueError('api_key must start with "sk-live-"')
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def request(self, method: str, path: str, body: Any = None) -> Any:
        url = f"{self.base_url}{path}"
        data = json.dumps(body).encode() if body is not None else None
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "perpetual-python-sdk/1.0",
        }
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            raw = e.read()
            try:
                body_parsed = json.loads(raw)
                msg = body_parsed.get("message", str(e))
            except Exception:
                msg = raw.decode(errors="replace")
                body_parsed = msg
            raise PerpetualError(msg, e.code, body_parsed) from e

    def get(self, path: str) -> Any:
        return self.request("GET", path)

    def post(self, path: str, body: Any = None) -> Any:
        return self.request("POST", path, body)

    def put(self, path: str, body: Any = None) -> Any:
        return self.request("PUT", path, body)

    def delete(self, path: str) -> Any:
        return self.request("DELETE", path)

    def patch(self, path: str, body: Any = None) -> Any:
        return self.request("PATCH", path, body)
