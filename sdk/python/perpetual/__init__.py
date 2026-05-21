from __future__ import annotations
from .http import HttpClient
from .resources.sandbox import SandboxResource
from .resources.memory import MemoryResource
from .resources.council import CouncilResource
from .resources.loops import LoopsResource
from .types import (
    PerpetualError, Sandbox, RunResult, ApiKey,
    MemoryEntry, CouncilSession, LoopConfig, LoopRun, UsageToday,
)


class Perpetual:
    """Perpetual Sandbox Engine — Python SDK.

    Usage::

        from perpetual import Perpetual

        client = Perpetual(api_key="sk-live-...")

        # Run Python code in an isolated sandbox
        result = client.sandbox.run_once("python", "print('hello world')")
        print(result.stdout)

        # Ask the 6-agent council to solve a problem
        session = client.council.run_and_wait("Implement a rate limiter in Python")
        print(session.result["synthesis"])

        # Persist agent memory across runs
        client.memory.set("architect", "last-plan", {"steps": [...]})
        plan = client.memory.get("architect", "last-plan")

        # Register a continuous monitoring loop
        loop = client.loops.create("prod-monitor", interval_secs=3600)
        client.loops.trigger(loop.loop_id)
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.perpetual.dev",
        timeout: int = 30,
    ) -> None:
        http = HttpClient(api_key=api_key, base_url=base_url, timeout=timeout)
        self.sandbox = SandboxResource(http)
        self.memory = MemoryResource(http)
        self.council = CouncilResource(http)
        self.loops = LoopsResource(http)


__all__ = [
    "Perpetual",
    "PerpetualError",
    "Sandbox",
    "RunResult",
    "ApiKey",
    "MemoryEntry",
    "CouncilSession",
    "LoopConfig",
    "LoopRun",
    "UsageToday",
]
