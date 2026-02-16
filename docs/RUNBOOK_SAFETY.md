# Runbook Safety

Before running operational scripts, verify you are in the correct repository root:

```powershell
pwsh -File .\scripts\ensure-repo.ps1
```

If the guard fails, stop and switch to `C:\Users\vitor\Dev\factory` before running other commands.
