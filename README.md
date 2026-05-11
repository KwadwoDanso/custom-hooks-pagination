# Custom Hooks Lab — usePagination & useDebounce

Two reusable custom React hooks built from scratch with TypeScript, each demonstrated by an interactive component that showcases every feature the hook exposes.

## Table of contents

- [Overview](#overview)
- [Links](#links)
- [How to run](#how-to-run)


- [Demo components](#demo-components)
- [Architecture](#architecture)
- [How it works](#how-it-works)
- [Edge cases handled](#edge-cases-handled)
- [Built with](#built-with)
- [What I learned](#what-i-learned)
- [Reflections](#reflections)
- [Author](#author)

## Overview

This lab implements two common custom hooks that solve real problems in production React applications. `usePagination` manages client-side pagination logic — calculating page counts, indices, and navigation state from a total item count. `useDebounce` delays a rapidly changing value so downstream effects (like API calls) only fire after the user stops typing. Both hooks are generic, reusable, and fully typed.

## Links

- Solution URL: (https://github.com/KwadwoDanso/custom-hooks-pagination)

## How to run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Both demos render on a single page — pagination on top, debounce search below.



## How it works

### usePagination internals

The hook stores one piece of state: `currentPage` via `useState(initialPage)`. Everything else is derived:

```
currentPage (state)
    │
    ▼
totalPages = Math.ceil(totalItems / itemsPerPage)    ← useMemo
    │
    ▼
clampedPage = clamp(currentPage, 1, totalPages)      ← useMemo
    │
    ├─► startIndex = (clampedPage - 1) * itemsPerPage    ← useMemo
    │       │
    │       ▼
    │   endIndex = min(startIndex + itemsPerPage, totalItems) - 1  ← useMemo
    │       │
    │       ▼
    │   itemsOnCurrentPage = endIndex - startIndex + 1    ← useMemo
    │
    ├─► canNextPage = clampedPage < totalPages
    └─► canPrevPage = clampedPage > 1
```

`setPage`, `nextPage`, and `prevPage` all call `setCurrentPage`. The clamping happens downstream in the `clampedPage` memo, so the navigation functions don't need bounds-checking — they just set the raw value and let the derived chain handle validity.

### useDebounce internals

```
value (prop) ──► useEffect ──► setTimeout ──► setDebouncedValue
                    │
                    └── cleanup: clearTimeout (runs before each new effect)
```

The effect fires whenever `value` or `delay` changes. On each fire, it clears the old timer and sets a new one. Only when no new fires happen for `delay` ms does the timer callback execute and update `debouncedValue`. This is the textbook debounce pattern, implemented with React's effect cleanup model instead of a manual `clearTimeout` tracking variable.

---

## Edge cases handled

### usePagination

| Scenario | Behavior |
|---|---|
| `totalItems = 0` | `totalPages = 0`, `currentPage = 0`, `startIndex = -1`, `endIndex = -1`, `itemsOnCurrentPage = 0` |
| `setPage(0)` or `setPage(-5)` | Clamped to page 1 (minimum valid page) |
| `setPage(999)` when `totalPages = 5` | Clamped to page 5 (maximum valid page) |
| User on page 10, changes `itemsPerPage` so only 3 pages exist | `clampedPage` auto-snaps to page 3 |
| `nextPage()` called when already on last page | `currentPage` increments past `totalPages`, but `clampedPage` holds at `totalPages` |
| Last page has fewer items | `endIndex` stops at `totalItems - 1`, `itemsOnCurrentPage` reflects the shorter count |

### useDebounce

| Scenario | Behavior |
|---|---|
| User types 10 characters rapidly | Only 1–2 `debouncedValue` updates (one per typing pause) |
| `delay` changes mid-typing | Timer resets with the new delay value (correct because `delay` is in the dependency array) |
| `delay = 0` | `debouncedValue` updates on the next tick (still async, but effectively instant) |
| Component unmounts while timer is pending | `clearTimeout` runs in the effect cleanup — no state update on unmounted component |

---

## Built with

- React with `useState`, `useEffect`, `useMemo`, `useCallback`
- TypeScript with strict mode and `verbatimModuleSyntax`
- Vite for dev server and build
- No external libraries — both hooks use only React primitives

## What I learned

- **Custom hooks are just functions that call other hooks.** There's no special registration, no decorator, no class — just a function named `uses*` that calls `useState`, `useEffect`, etc. The composition model means complex behavior emerges from simple primitives.
- **`useMemo` for derived values prevents unnecessary recalculation.** In `usePagination`, `totalPages` only recalculates when `totalItems` or `itemsPerPage` change. Without `useMemo`, every render would recompute every derived value even if nothing relevant changed.
- **`useCallback` stabilizes function references.** `setPage`, `nextPage`, and `prevPage` are wrapped in `useCallback` with empty dependency arrays because they only call `setCurrentPage` (which is already stable from `useState`). If a child component receives these as props, it won't re-render just because the parent re-rendered.
- **Effect cleanup IS the debounce mechanism.** The classic debounce pattern uses a variable to track the timer ID and manually calls `clearTimeout`. React's `useEffect` cleanup function does this naturally — each new effect clears the previous timer. The two patterns are structurally identical but the React version is cleaner because lifecycle management is built into the framework.
- **Generics make hooks reusable across types.** `useDebounce<T>` works with strings, numbers, objects — anything. TypeScript infers `T` from the argument, so consumers don't even need to specify it: `useDebounce("hello")` infers `string`, `useDebounce(42)` infers `number`.
- **Edge cases reveal design assumptions.** Deciding what `startIndex` should be when `totalItems = 0` forced me to think about the hook's contract: does "no items" mean index 0 (misleading — suggests a valid position) or -1 (sentinel for "nothing")? I chose -1 because consumers can check `if (startIndex < 0)` to detect the empty case.

## Reflections

These two hooks solve genuinely different problems but share the same design philosophy: one piece of state, everything else derived. `usePagination` stores `currentPage` and derives 9 values from it. `useDebounce` stores `debouncedValue` and derives it from a timer side effect. Neither hook tries to do too much — they expose raw values and functions, leaving the rendering and layout entirely to the consuming component.

The pagination hook was the more complex implementation. The clamping logic — ensuring `currentPage` never exceeeds `totalPages` even when `itemsPerPage` changes — required careful thought about the dependency chain. The key insight was to separate the raw `currentPage` state from the derived `clampedPage` memo. Navigation functions write to the raw state; the rendered output reads from the clamped value. That separation means bounds-checking happens in exactly one place.

The debounce hook was simpler but more elegant. React's effect cleanup model maps perfectly onto the debounce pattern — `clearTimeout` in the cleanup is both the mechanism and the explanation. No external library needed.

## Author

- Kwadwo Danso

## Acknowledgement
- PerScholas Documentation
- AI assistance
- reactdev online resouces

