from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any


class PerpetualError(Exception):
    def __init__(self, message: str, status_code: int, body: Any = None) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.body = body


@dataclass
class Sandbox:
    sandbox_id: str
    status: str
    language: str
    timeout_secs: int
    started_at: str | None
    terminated_at: str | None
    created_at: str


@dataclass
class RunResult:
    stdout: str
    stderr: str
    exit_code: int
    duration_secs: int


@dataclass
class ApiKey:
    id: str
    prefix: str
    name: str
    last_used_at: str | None
    created_at: str
    key: str | None = None  # only present on create


@dataclass
class MemoryEntry:
    namespace: str
    key: str
    value: Any
    expires_at: str | None
    created_at: str
    updated_at: str


@dataclass
class CouncilSession:
    session_id: str
    status: str
    task: str
    result: dict[str, Any] | None
    error: str | None
    created_at: str
    updated_at: str


@dataclass
class LoopConfig:
    loop_id: str
    name: str
    description: str | None
    interval_secs: int
    is_active: bool
    last_run_at: str | None
    next_run_at: str | None
    webhook_url: str | None
    created_at: str


@dataclass
class LoopRun:
    run_id: str
    loop_id: str
    status: str
    issues_found: int
    issues_fixed: int
    monitor_summary: str | None
    healer_summary: str | None
    created_at: str
    completed_at: str | None


@dataclass
class UsageToday:
    date: str
    runs: int
    used_secs: int
    free_secs: int
    free_remaining_secs: int
    billed_amount_usd: float
    price_per_second_usd: float
