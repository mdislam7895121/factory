from __future__ import annotations
import time
from typing import Literal
from ..http import HttpClient
from ..types import Sandbox, RunResult, PerpetualError


class SandboxResource:
    def __init__(self, http: HttpClient) -> None:
        self._http = http

    def create(
        self,
        language: Literal["python", "nodejs", "bash"],
        timeout_secs: int = 300,
    ) -> Sandbox:
        data = self._http.post("/v1/sandbox/create", {"language": language, "timeout_secs": timeout_secs})
        return Sandbox(**data)

    def get(self, sandbox_id: str) -> Sandbox:
        data = self._http.get(f"/v1/sandbox/{sandbox_id}")
        return Sandbox(**data)

    def run(self, sandbox_id: str, code: str) -> RunResult:
        data = self._http.post(f"/v1/sandbox/{sandbox_id}/run", {"code": code})
        return RunResult(**data)

    def terminate(self, sandbox_id: str) -> dict:
        return self._http.delete(f"/v1/sandbox/{sandbox_id}")

    def run_once(
        self,
        language: Literal["python", "nodejs", "bash"],
        code: str,
        timeout_secs: int = 300,
        wait_secs: float = 15.0,
    ) -> RunResult:
        """Create sandbox, run code, terminate — all in one call."""
        sb = self.create(language, timeout_secs=timeout_secs)
        deadline = time.monotonic() + wait_secs

        while sb.status == "creating" and time.monotonic() < deadline:
            time.sleep(0.5)
            sb = self.get(sb.sandbox_id)

        if sb.status != "ready":
            self.terminate(sb.sandbox_id)
            raise PerpetualError(
                f"Sandbox failed to start (status={sb.status})", 0
            )

        try:
            return self.run(sb.sandbox_id, code)
        finally:
            self.terminate(sb.sandbox_id)
