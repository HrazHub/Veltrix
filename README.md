# VELTRIX — by HRAZHUB
# Thanks for all who support me from beggining

**YOUR GAMES. ONE PLACE.**

VELTRIX is a native Windows desktop game library manager built with Electron, React and TypeScript. It brings manually added games, supported launcher libraries, playtime, collections, a wishlist, statistics and save backups into one local application — without pretending to be a store or a game downloader.

> VELTRIX is an independent project by HRAZHUB. It is not affiliated with Valve, Epic Games, GOG, Ubisoft, Electronic Arts, Microsoft, Blizzard or RAWG.

---

## What is included

| Area | What works |
| --- | --- |
| **Home** | Real library summary, recent/favorite games, quick actions, wishlist countdown based on stored dates |
| **My Library** | Add, edit, remove, search, sort, filter, favorite, scan a folder for executables, grid/list views |
| **Game details** | Artwork, metadata, requirements, private notes, install verification, launch validation, save-path folder, per-game backups, collections |
| **Discover** | RAWG trending/new/genre data once you supply your own API key; local taste signals never mixed with RAWG scores |
| **Game Database** | Live RAWG search and detail panels, caching, pagination, loading/error/empty states, add to library or wishlist |
| **Multi-Launcher** | Detects Steam, Epic, GOG, Ubisoft, EA app, Xbox app and Battle.net; imports only Steam, Epic, GOG and Ubisoft where real local data exists |
| **Wishlist** | Manual or RAWG entries, release dates, reminders, filters and sorting — no invented prices or store links |
| **Downloads** | Only real VELTRIX artwork/cache transfers it performed itself, plus honest disk-space and launcher-download-folder information |
| **Statistics** | Charts built exclusively from sessions VELTRIX actually tracked |
| **Collections** | Create, rename, delete and group games into custom shelves |
| **Settings** | Theme, accent palette, layout, startup page, folder defaults, API key, notifications, import/export, backup/restore |
| **About VELTRIX** | Version/build information, live Windows system information, community link and honest limitations |

### Deliberately not included

- No commercial game downloads, installs, updates or uninstalls.
- No store account credentials, purchase entitlements or live store prices.
- No fabricated game records, ratings, prices, download progress or launcher connections.
- No analytics, telemetry, account system or cloud dependency.
- No online updater in this build. Install a newer build manually when one is published.

---

## Requirements

- **Windows 10 or Windows 11, 64-bit**
- **Node.js 20+** and npm (only needed to build from source)
- A free **RAWG API key** is optional. Without it, Discover and Game Database show clear configuration states instead of errors or fake data. Get a key at <https://rawg.io/apidocs>.

The packaged application does not require Node.js or any external runtime.

---

## Install and run from source

```bash
npm install
npm run dev
```

`npm run dev` builds the Electron main/preload bundles, starts the Vite dev server on port 5173 and launches VELTRIX with hot reload for the renderer.

### Production build

```bash
npm run build
npm start        # optional: run the production renderer/main bundles locally
```

`npm run build` writes:

- `dist/` — the compiled React renderer
- `dist-electron/` — bundled Electron main, preload and splash scripts

### Windows installer and portable EXE

```bash
npm run dist
```

electron-builder produces:

- `release/VELTRIX-Setup.exe` — NSIS installer with desktop/Start menu shortcuts, custom install directory, uninstall support and user-data preservation
- `release/VELTRIX-Portable.exe` — portable single-file executable
- `release/win-unpacked/VELTRIX.exe` — unpacked application directory

The installer is published as **HRAZHUB**, uses the VELTRIX icon, and does **not** delete `%APPDATA%\VELTRIX` when uninstalling.

---

## Verification

VELTRIX ships with an automated end-to-end smoke test that drives the real Electron application inside an isolated profile.

```bash
npm run verify
```

This builds nothing by itself, so run `npm run build` first. It launches Electron with `--smoke-test`, using a temporary `VELTRIX_USER_DATA` profile and writes results/screenshots to a temporary output folder. It verifies:

- Database persistence, game updates, favorites, collections, wishlist and settings
- Per-game save backup and restore against a real temporary folder
- All 12 routes render with expected content, no loading skeletons, no runtime error text and no horizontal overflow
- No renderer console errors
- A screenshot of every route

To verify a packaged executable:

```bash
node scripts/verify.mjs --exe release/win-unpacked/VELTRIX.exe
```

The isolated verification profile never touches your real library.

---

## Where your data lives

VELTRIX forces its user data into a predictable folder:

```
%APPDATA%\VELTRIX\
  data\velitrix.db     SQLite database (games, settings, sessions, collections, wishlist)
  artwork\             Imported and downloaded artwork
  backups\             Default game save backups created from game pages
  logs\                Application logs
```

- The database uses Electron's built-in `node:sqlite` module. No external SQLite service or native build tools are required.
- Uninstalling VELTRIX keeps this folder by default.
- Settings → Data & backups can export/import a JSON library, back up the entire app-data folder, restore a staged backup after restart, and clear the RAWG cache.
- Set `VELTRIX_USER_DATA` before launch to use a different profile folder (used by the automated verification suite).

---

## RAWG setup

1. Create a free account at <https://rawg.io/apidocs> and copy your API key.
2. Open **Settings → Integrations** in VELTRIX.
3. Paste the key and choose **Save key**. It is encrypted with Windows secure storage (`safeStorage`) and kept in the Electron main process.
4. Use **Test** to verify the connection.

If Windows secure credential storage is unavailable, VELTRIX refuses to persist a key and explains that `RAWG_API_KEY` can be supplied as an environment variable instead. The key is never exposed to the renderer or written to logs. RAWG responses are cached locally to respect rate limits.

---

## Launcher support

| Launcher | Detection | Automatic import | Launch |
| --- | --- | --- | --- |
| Steam | Yes | Yes (appmanifest files across libraries) | `steam://` protocol |
| Epic Games | Yes | Yes (installed-game manifests) | `com.epicgames.launcher://` protocol |
| GOG Galaxy | Yes | Yes (Windows registry) | Direct executable (DRM-free) |
| Ubisoft Connect | Yes | Yes (Windows registry) | `uplay://` protocol |
| EA app | Yes | **No** — no supported public local import API | Launch through EA app |
| Xbox app | Yes | **No** — no supported public local import API | Launch through Xbox app |
| Battle.net | Yes | **No** — no supported public local import API | Launch through Battle.net |

VELTRIX never asks for launcher passwords. Imported games still launch through their official launcher, so authentication, DRM and updates remain intact. Unsupported stores are labelled honestly instead of showing a simulated connection.

---

## Security and privacy

- `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`
- A typed preload bridge (`window.velitrix`) is the only renderer API surface
- IPC handlers validate arguments and stay in the main process
- Strict Content-Security-Policy in the renderer
- Custom `velitrix-media://artwork/...` protocol restricted to the managed artwork folder
- RAWG network calls happen only in the main process
- External links use a validated allow-list through `shell.openExternal`
- Native exit confirmation is enforced by the main process when enabled

No telemetry, ads, accounts or cloud sync. Your library, artwork, saves and settings remain on your PC.

---

## Project structure

```
electron/            Electron main process, preload, IPC, database and services
  main.ts            Window lifecycle, splash, protocol, close confirmation, smoke mode
  preload.ts         Typed contextBridge API
  ipc.ts             Validated IPC channel registration
  db.ts              SQLite schema and migrations (node:sqlite)
  games.ts           Game CRUD, launch validation, play sessions
  launchers.ts       Local launcher detection and supported imports
  rawg.ts            RAWG client, cache and artwork handling
  settings.ts        Settings validation and encrypted API key storage
  data.ts            Library import/export and app-data backup/restore
  smoke.ts           Automated end-to-end verification
shared/types.ts      Shared renderer/main TypeScript contract
src/                 React renderer
  App.tsx            12-route application shell
  pages/             Home, Library, Game details, Discover, Database, Launchers,
                     Wishlist, Downloads, Statistics, Collections, Settings, About
  components/        Design system, artwork, modal, logo and page components
  context/           Settings, confirm dialog, toast and data-version providers
scripts/             Icon generation, Electron bundling and verification runner
build/               Application icons used by the installer
```

---

## Scripts

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies and generate icons |
| `npm run dev` | Vite dev server + Electron with hot reload |
| `npm run build` | Production renderer and Electron bundles |
| `npm start` | Launch the built application with Electron |
| `npm run typecheck` | TypeScript checks for renderer and Electron |
| `npm run verify` | Run the isolated end-to-end smoke test |
| `npm run dist` | Build and create the installer + portable EXE |
| `npm run dist:dir` | Build an unpacked Windows app directory |

---

## Troubleshooting

**The app shows a blank window in development.**
Ensure Vite is running on port 5173 and that `VITE_DEV_SERVER_URL` is set by the `dev` script. Run `npm run build` first if the Electron main bundle is missing.

**RAWG says the key is not configured.**
Add the key in Settings → Integrations. Environment variable detection is also supported. Keys cannot be stored if Windows secure storage is unavailable.

**A launcher is detected but no games import.**
Automatic import exists only for Steam, Epic, GOG and Ubisoft, and only when that launcher exposes local manifests or registry entries. EA app, Xbox app and Battle.net are detection-only.

**Playtime stays at zero for an imported game.**
VELTRIX only counts launches it performs itself. Games started directly from a launcher are not observed and are never estimated.

**Where are the installer logs?**
electron-builder writes build output to the console and artifacts to `release/`. Runtime logs are in `%APPDATA%\VELTRIX\logs\`.

---

## Community

Official HrazHub Discord: <https://discord.gg/msMuRCPQNQ>

---

Copyright © 2026 HRAZHUB. All rights reserved. VELTRIX is an independent game library manager and does not include any game files.
