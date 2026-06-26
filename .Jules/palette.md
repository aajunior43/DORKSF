## 2026-06-26 - Focus Visibility in Brutalist Design
**Learning:** The `.brutal-*` CSS classes commonly used in this design system (e.g., `.brutal-input`) use `outline: none` to remove default browser styling. This completely breaks keyboard navigation as there is no visible focus indicator.
**Action:** Use `focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none` as the standard accessible focus state pattern for interactive elements using this brutalist design system.
