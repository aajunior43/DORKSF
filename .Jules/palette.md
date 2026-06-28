## 2024-10-24 - Brutalist Keyboard Accessibility Issue
**Learning:** The project's brutalist design system globally sets `outline: none` via `.brutal-*` classes, intentionally removing default focus rings and making the application inaccessible to keyboard users.
**Action:** Always append the standard Tailwind focus ring classes (`focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none`) to all new interactive elements to restore keyboard accessibility while remaining visually consistent with the thick black borders of the brutalist aesthetic.
