# TOP app (Toezicht op pad) v2

De TOP app verzorgt de informatievoorziening voor toezichthouders op pad. Door middel van een variabele configuratie kunnen zij een looplijst van adressen samenstellen.

## Install

Clone this repository and install its dependencies:

```bash
git clone https://github.com/Amsterdam/top-frontend-v2.git
cd top-frontend-v2
npm install
```

## Running

Using the acceptance backend is easiest:

```bash
npm start
```

## PWA

The app now exposes a web app manifest and service worker so it can be
installed as a PWA.

- Installed launches open directly on `/lijst-instellingen`, the first step.
- Offline support depends on having opened the app online at least once so the
  shell and cached API responses are available.

### Caching strategy

- **App shell / static assets:** precached at build time by Workbox.
- **Runtime config (`/config/env.js`):** `NetworkFirst`, so the app prefers the
  latest environment config but can still boot from a cached copy offline.
- **All API `GET` requests:** `NetworkFirst`.
  - This applies to requests under `/api/v1/` on any host, including the main
    backend and the separate puntenteller backend.
  - PDOK search requests are also `NetworkFirst`.
  - If the network is unavailable, the last successful cached `GET` response is
    used when available.
- **Mutating API requests (`POST`, `PUT`, `PATCH`, `DELETE`):** network only.
  - Visit-related changes made while offline are stored in a local queue.
  - The queue is replayed automatically when the app comes back online, or on
    the next app launch while online.
- **Retention:** runtime API caches are kept for up to 24 hours.

### Offline UI

- When the browser is offline, the page header menu shows `WiFiIcon` with the
  label `Offline`.
- Saving or completing a visit while offline shows a success toast explaining
  that the change is queued and will sync automatically.

## Deploying

The `main` branch is automatically deployed to [acceptance](https://acc.top.amsterdam.nl/).

Tag any branch, but preferably main, with a tag like `v1.0.0` to deploy that specific commit
to [production](https://top.amsterdam.nl/).

## Update generated API Scheme

Generate typings in `__generated__` directory.

```typescript
npm run generate:api-schema:acc
```

## Directory tree structure

```typescript
tree -I "node_modules|.next|.git" -L 10 > directory-tree.txt
```

## Install local ee-ads-rhf package

1. Go to the ee-ads-rhf repo.
2. Run `npm run build`
3. Copy paste the .tgz file to this repo.
4. Install:

```typescript
npm install ./amsterdam-ee-ads-rhf-lib-0.0.0.tgz
```
