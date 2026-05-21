from __future__ import annotations
import time
from typing import Any
from ..http import HttpClient
from ..types import CouncilSession, PerpetualError


class CouncilResource:
    def __init__(self, http: HttpClient) -> None:
        self._http = http

    def run(self, task: str, context: dict[str, Any] | None = None) -> dict:
        body: dict[str, Any] = {"task": task}
        if context:
            body["context"] = context
        return self._http.post("/v1/council/run", body)

    def list(self, limit: int = 20) -> list[dict]:
        return self._http.get(f"/v1/council?limit={limit}")

    def get(self, session_id: str) -> CouncilSession:
        data = self._http.get(f"/v1/council/{session_id}")
        return CouncilSession(**data)

    def messages(self, session_id: str) -> dict:
        return self._http.get(f"/v1/council/{session_id}/messages")

    def wait(
        self,
        session_id: str,
        poll_secs: float = 3.0,
        timeout_secs: float = 300.0,
    ) -> CouncilSession:
        deadline = time.monotonic() + timeout_secs
        while time.monotonic() < deadline:
            session = self.get(session_id)
            if session.status in ("completed", "failed"):
                return session
            time.sleep(poll_secs)
        raise PerpetualError(
            f"Council session {session_id} did not complete within {timeout_secs}s", 0
        )

    def run_and_wait(
        self,
        task: str,
        context: dict[str, Any] | None = None,
        poll_secs: float = 3.0,
        timeout_secs: float = 300.0,
    ) -> CouncilSession:
        result = self.run(task, context)
        return self.wait(result["session_id"], poll_secs=poll_secs, timeout_secs=timeout_secs)
