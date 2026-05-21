from __future__ import annotations
from typing import Any
from ..http import HttpClient
from ..types import LoopConfig, LoopRun


class LoopsResource:
    def __init__(self, http: HttpClient) -> None:
        self._http = http

    def create(
        self,
        name: str,
        interval_secs: int = 3600,
        description: str | None = None,
        context: dict[str, Any] | None = None,
        webhook_url: str | None = None,
    ) -> LoopConfig:
        body: dict[str, Any] = {"name": name, "interval_secs": interval_secs}
        if description:
            body["description"] = description
        if context:
            body["context"] = context
        if webhook_url:
            body["webhook_url"] = webhook_url
        data = self._http.post("/v1/loops", body)
        return LoopConfig(**data)

    def list(self) -> list[LoopConfig]:
        return [LoopConfig(**d) for d in self._http.get("/v1/loops")]

    def get(self, loop_id: str) -> LoopConfig:
        return LoopConfig(**self._http.get(f"/v1/loops/{loop_id}"))

    def pause(self, loop_id: str) -> dict:
        return self._http.patch(f"/v1/loops/{loop_id}/pause")

    def resume(self, loop_id: str) -> dict:
        return self._http.patch(f"/v1/loops/{loop_id}/resume")

    def trigger(self, loop_id: str) -> dict:
        return self._http.post(f"/v1/loops/{loop_id}/trigger")

    def runs(self, loop_id: str, limit: int = 20) -> list[LoopRun]:
        data = self._http.get(f"/v1/loops/{loop_id}/runs?limit={limit}")
        return [LoopRun(**d) for d in data]

    def delete(self, loop_id: str) -> dict:
        return self._http.delete(f"/v1/loops/{loop_id}")
