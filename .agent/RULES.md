# Agent Rules (Non-Breaking)

## Non-Breaking Policy
- All changes are additive and non-breaking by default.
- Existing application logic must not be modified unless explicitly requested.
- No refactors are allowed unless explicitly requested.

## Proof-First Policy
- No task is marked complete without proof artifacts.
- Required proof includes command outputs for repository state and verification steps.

## Minimal-Diff Policy
- Apply the smallest possible change set to satisfy the requested scope.
- Do not change unrelated files.

## Rollback Requirement
- Every risky change must include explicit rollback commands.
- Rollback steps must be executable from repository root.

## No-Secret Policy
- Credentials and tokens must come from environment variables.
- Never commit secrets.
- Never print secret values in logs.
