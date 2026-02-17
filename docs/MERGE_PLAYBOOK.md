# Merge Playbook (SERIAL 07)

This playbook standardizes a no-waste PR merge flow while keeping strict branch protection rules intact.

## Branch Protection Requirements (must remain enabled)

- Required status checks with strict mode
- Required signatures
- Enforce admins
- Required conversation resolution
- Required linear history

## Required Context Name (exact)

The required status check context is:

`CI/Proof Runner Gate (pull_request)`

If a PR appears green but still blocks merge, verify the context name is an exact string match.

## Standard No-Waste Flow

1. Check PR merge state and checks.
2. Confirm required contexts from `main` branch protection.
3. If checks are pending, wait.
4. If checks are green and policy still blocks normal merge, use admin merge.

## Commands

```powershell
# 1) PR state and checks
gh pr view <PR_NUMBER> --json number,url,state,mergeStateStatus,reviewDecision
gh pr checks <PR_NUMBER>

# 2) Required contexts from branch protection
gh api repos/mdislam7895121/factory/branches/main/protection --jq '{strict:.required_status_checks.strict, contexts:.required_status_checks.contexts, required_signatures:.required_signatures.enabled, enforce_admins:.enforce_admins.enabled, required_linear_history:.required_linear_history.enabled, required_conversation_resolution:.required_conversation_resolution.enabled}'

# 3) If all required checks are green and normal merge is blocked
gh pr merge <PR_NUMBER> --squash --admin
```

## Detecting Context Mismatch

- Symptom: PR checks show success, but merge remains blocked unexpectedly.
- Check: compare workflow check context names on the PR with `required_status_checks.contexts` from branch protection.
- Fix: update workflow job context names to exactly match the required context string.

## Notes

- `--auto` can be enabled and accepted, but policy may still keep a PR blocked in some repository setups.
- This playbook does not change any repository settings; it is operational guidance only.