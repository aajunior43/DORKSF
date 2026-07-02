## 2024-03-20 - Missing Focus Indicators in Brutalist Design
**Learning:** The `.brutal-*` CSS classes in this project use `outline: none`, completely removing default focus indicators. This makes the interface inaccessible for keyboard users, as they cannot tell which element has focus.
**Action:** Always apply `focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none` to all interactive elements to standardize accessible focus states using existing Tailwind classes without compromising the brutalist aesthetic.
