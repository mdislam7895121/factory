# Serial Step B Proof - Local Auth + Identity Baseline (Mobile)

Date: 2026-02-11
Owner: Vitor
Status: Pending manual verification

## Definition of Done (Checklist)

- [x] Auth storage uses SecureStore (`expo-secure-store`)
- [x] Auth context with dev mock login and persistence
- [x] API client injects Authorization header when token exists
- [x] Login and Profile screens exist
- [x] App flow gates content behind login
- [ ] Manual testing completed (see checklist below)
- [ ] Evidence captured (screenshots or terminal logs)

## Files Changed (git diff --stat)

```
mobile/App.js               |  94 ++++++++++++++++++++--
mobile/README.md            | 187 ++++++++++++++++++++++++++++++++++++++++++++
mobile/app.json             |   5 +-
mobile/package-lock.json    |  10 +++
mobile/package.json         |   1 +
mobile/src/lib/apiClient.js |  20 ++++-
6 files changed, 308 insertions(+), 9 deletions(-)
```

## Implementation Notes

- Auth files: `mobile/src/auth/`
- Screens: `mobile/src/screens/LoginScreen.js`, `mobile/src/screens/ProfileScreen.js`
- App integration: `mobile/App.js` wraps app in AuthProvider and routes between Login/Profile/Diagnostics
- API auth: `mobile/src/lib/apiClient.js` adds `Authorization: Bearer <token>` when available

## Manual Test Checklist

- [ ] Start mobile app (`npm start`)
- [ ] Login screen appears on first launch
- [ ] Dev mode warning is visible
- [ ] Invalid email shows error
- [ ] Short password shows error
- [ ] Valid login works (example: `test@factory.local` / `password123`)
- [ ] Home screen shows user email
- [ ] Profile screen shows user + token (truncated)
- [ ] Diagnostics still works
- [ ] Logout returns to login
- [ ] Restart app keeps session (token persistence)

## Evidence

- (Add screenshots or terminal output here after manual tests)

## Non-Breaking Confirmation

- [x] No changes under `api/`
- [x] No changes under `web/`

## Notes

- This is a dev-only auth mock; backend auth endpoints will replace it later.
