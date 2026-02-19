# Factory Workspace

This repo is the Windows Software Factory:
- web/   (Next.js)
- api/   (Node backend)
- mobile/ (Expo)
- config/ (shared config)
- scripts/ (automation)
- docs/  (specs, proof, runbooks)

Rules:
- Step-by-step only
- Proof required for every phase
- Secrets via environment variables only

## Hosted Preview URLs

This repository uses Vercel for hosted web deployments:

- Pull requests: automatic **Preview Deploy (web)** with a unique share URL.
- `main`: automatic **Production Deploy (web)** with a stable production URL.

Required GitHub Actions repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

GitHub UI path to add secrets:

`Repository -> Settings -> Secrets and variables -> Actions -> Repository secrets`
