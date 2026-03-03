# Bug report: toast `type` colors are ignored when `backgroundColor` is present

## Summary

When showing a toast with a semantic `type` (`success`, `error`, `warning`, `info`), the expected type color is not always applied. In some cases, the toast uses the default/custom background instead.

## Environment

- React Native (Expo)
- Custom toast provider from this library
- Observed on: 2026-03-03

## Expected behavior

`toast.show("Saved", { type: "success" })` should render the success background color, and similarly for `error`, `warning`, and `info`.

## Actual behavior

The toast keeps the default background color.

## Minimal reproduction

```ts
toast.show("Saved", { type: "success" });
```

In our case, options are merged with defaults where `backgroundColor` is present (including empty string), and the render path prioritizes `backgroundColor` over `type`.

## Root cause (suspected)

If `backgroundColor` exists in options as `""` (empty string), fallback logic based on nullish coalescing (`??`) still treats it as a defined value. That prevents fallback to `getBackgroundColor(type)`.

Example pattern causing issue:

```ts
const backgroundColor =
  options.backgroundColor ?? getBackgroundColor(options.type);
```

## Proposed fix

Use custom `backgroundColor` only when non-empty; otherwise fall back to type color.

```ts
const customBackgroundColor = options.backgroundColor?.trim();
const backgroundColor = customBackgroundColor
  ? customBackgroundColor
  : getBackgroundColor(options.type);
```

## Additional suggestion

In default options, avoid forcing `backgroundColor` unless strictly necessary (prefer `undefined`/absence), so `type` mapping remains the source of truth by default.

## Why this matters

This impacts semantic feedback consistency (`success`, `error`, `warning`, `info`) across apps using the library.
