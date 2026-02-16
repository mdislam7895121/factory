# Agent Workflow (Enforced Loop)

1. Read-first inspection
   - Inspect current repository state before changing files.
   - Confirm target scope and affected files.

2. Plan (explicit file list)
   - List exact files to add or modify.
   - Define minimal, non-breaking actions only.

3. Patch (smallest possible change)
   - Apply only the minimum patch required.
   - Avoid unrelated edits.

4. Verify (lint/typecheck/test/smoke)
   - Run applicable validation commands for touched scope.
   - Fail fast on errors.

5. Capture proof artifacts
   - Save command outputs for status, diff, and verification logs.
   - Include run identifiers/URLs where applicable.

6. Provide rollback commands
   - Provide explicit revert/reset commands matching the applied patch.

7. Stop
   - Stop after proof pack is complete and scope is fully satisfied.
