# Task Manager (Local Storage)

A lightweight task manager with inline table editing, status/priority filters, sorting, and localStorage persistence. Built as a single-page HTML/JS/CSS app—just open in the browser.

## Features
- Create tasks with title, description, due date, priority (Low/Medium/High).
- Status control: To Do / In Progress / Done, plus a quick "Done" checkbox.
- Filters by status and priority; sort by priority high→low or low→high.
- Inline edit and delete (with confirmation).
- Stats badges for Total / To Do / In Progress / Done.
- Empty state, success toast, hover/animation polish, and priority color badges.
- Data persists in `localStorage` across refreshes.

## Getting Started
1. Open `index.html` in your browser (no build step needed).
2. Add a task (title required) and click **Add Task**.
3. Adjust status, priority, filters, or sorting as needed.

## How It Works
- Tasks are stored in `localStorage` under the `tasks` key.
- UI is rendered from `script.js` and styled by `style.css`.
- Filters and sorting re-render the in-memory tasks; nothing server-side.

## Notes
- If a newly added task is not visible, ensure filters are set to **All** and sorting to **None**.
- Delete prompts for confirmation to prevent accidental loss.

## Tech Stack
- HTML, CSS, JavaScript
- Local Storage for persistence
