from __future__ import annotations
from typing import Any
from urllib.parse import quote
from ..http import HttpClient
from ..types import MemoryEntry


class MemoryResource:
    def __init__(self, http: HttpClient) -> None:
        self._http = http

    def set(
        self,
        namespace: str,
        key: str,
        value: Any,
        ttl_secs: int | None = None,
    ) -> dict:
        body: dict[str, Any] = {"value": value}
        if ttl_secs is not None:
            body["ttl_secs"] = ttl_secs
        return self._http.put(f"/v1/memory/{_enc(namespace)}/{_enc(key)}", body)

    def get(self, namespace: str, key: str) -> MemoryEntry:
        data = self._http.get(f"/v1/memory/{_enc(namespace)}/{_enc(key)}")
        return MemoryEntry(**data)

    def list(self, namespace: str) -> dict:
        return self._http.get(f"/v1/memory/{_enc(namespace)}")

    def delete(self, namespace: str, key: str) -> dict:
        return self._http.delete(f"/v1/memory/{_enc(namespace)}/{_enc(key)}")

    def clear(self, namespace: str) -> dict:
        return self._http.delete(f"/v1/memory/{_enc(namespace)}")

    def log_event(self, namespace: str, event_type: str, payload: Any) -> dict:
        return self._http.post(
            f"/v1/memory/{_enc(namespace)}/events",
            {"event_type": event_type, "payload": payload},
        )

    def events(
        self,
        namespace: str,
        limit: int = 50,
        before: str | None = None,
    ) -> dict:
        params = f"?limit={limit}"
        if before:
            params += f"&before={quote(before)}"
        return self._http.get(f"/v1/memory/{_enc(namespace)}/events{params}")


def _enc(s: str) -> str:
    return quote(s, safe="")
