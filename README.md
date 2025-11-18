# Chat Clippings — Single-page React (Vite) app using Bun

This is a minimal single-page React app (Vite) scaffolded to be Bun-friendly. It stores categories and phrases in LocalStorage so everything is local to your browser.

Quickstart (using Bun):

1. Install dependencies:

```bash
cd /path/to/chat-clippings
bun install
```

2. Start dev server:

```bash
bun run dev
```

The app will be available at http://localhost:5173 by default.

Notes:
- This repo contains a simple UI to add/delete categories and add/edit/delete phrases inside categories.
- Data is persisted in LocalStorage under the key `chat-clippings-data-v1`.

If you want to re-create this project using Bun's template tooling:

```bash
bun create vite . --template react
```

Then copy or merge the files from this repository into the generated project.
