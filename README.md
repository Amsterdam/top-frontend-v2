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

## Deploying

The `main` branch is automatically deployed to [acceptance](https://acc.top.amsterdam.nl/).

Tag any branch, but preferably main, with a tag like `v1.0.0` to deploy that specific commit
to [production](https://top.amsterdam.nl/).

# Directory tree structure

```typescript
tree -I "node_modules|.next|.git" -L 10 > directory-tree.txt
```
