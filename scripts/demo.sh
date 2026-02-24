#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TS="$(date +%Y%m%d-%H%M%S)"
PROOF_DIR="$REPO_ROOT/proof/runs"
PROOF_FILE="$PROOF_DIR/serial21-demo-$TS.txt"

mkdir -p "$PROOF_DIR"
: > "$PROOF_FILE"

log() {
  echo "$1" | tee -a "$PROOF_FILE"
}

run_logged() {
  local label="$1"
  shift
  log "## $label"
  if "$@" >>"$PROOF_FILE" 2>&1; then
    return 0
  fi
  return 1
}

wait_http_200() {
  local name="$1"
  local url="$2"
  local attempts="${3:-40}"
  local delay="${4:-2}"
  local attempt

  for ((attempt=1; attempt<=attempts; attempt++)); do
    local status
    status="$(curl -sS -o /dev/null -w "%{http_code}" "$url" || true)"
    if [[ "$status" == "200" ]]; then
      log "${name}_attempt=${attempt} status=200"
      return 0
    fi
    log "${name}_attempt=${attempt} status=${status}"
    sleep "$delay"
  done

  log "ERROR=${name} did not return HTTP 200 within retry budget"
  return 1
}

cd "$REPO_ROOT"

log "# SERIAL 21 Demo Proof - $TS"
log "REPO_ROOT=$REPO_ROOT"

run_logged "Prerequisites: node --version" node --version
run_logged "Prerequisites: docker --version" docker --version
run_logged "Prerequisites: docker compose version" docker compose version
run_logged "Optional: railway --version" railway --version || true

run_logged "Start stack: docker compose up -d --build" docker compose -f docker/docker-compose.dev.yml up -d --build

wait_http_200 "db_health" "http://localhost:4000/db/health" 50 2
DB_BODY="$(curl -sS http://localhost:4000/db/health)"
log "db_health_body=$DB_BODY"

wait_http_200 "ready" "http://localhost:4000/ready" 50 2
READY_BODY="$(curl -sS http://localhost:4000/ready)"
log "ready_body=$READY_BODY"

TEMPLATES_BODY="$(curl -sS -w "\nHTTP_STATUS=%{http_code}" http://localhost:4000/v1/templates)"
log "templates_response=$TEMPLATES_BODY"

wait_http_200 "web" "http://localhost:3000/" 60 2
WEB_STATUS="$(curl -sS -I -o /dev/null -w "%{http_code}" http://localhost:3000/)"
log "web_status=$WEB_STATUS"

log "EXIT_CODE=0"
log "PROOF_FILE=$PROOF_FILE"
echo "SERIAL21_DEMO_PROOF=$PROOF_FILE"