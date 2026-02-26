# Release Policy

This repo uses a protected main branch. All changes must go through PRs and pass required checks.

## Versioning
- Use semantic version tags: vMAJOR.MINOR.PATCH
- Examples: v1.0.0, v1.2.3

## When to tag a release
- Tag only after a PR is merged into main and all required checks pass.
- Tag should point to a merge commit on main.

## How to create a release tag (PowerShell)
1) Sync main:
   git checkout main
   git pull --ff-only

2) Create an annotated tag:
   git tag -a vX.Y.Z -m "release: vX.Y.Z"

3) Push the tag:
   git push origin vX.Y.Z

## Notes
- Never force-push tags.
- If a release is bad, create a new patch release tag.