# Rough Tetris

A hand-drawn ([rough.js](https://roughjs.com/)) Tetris with serverless P2P multiplayer.

Play at https://pardo.github.io/tetris/

## Features

- **Solo or multiplayer** — a menu to host a room (get a 5-letter code) or join one.
- **Serverless P2P** via [Trystero](https://github.com/dmotz/trystero) (nostr strategy — no signalling server). Each opponent's live board renders above yours.
- **Mobile & responsive** — fluid layout, high-DPI canvases, and on-screen touch controls.
- Share a room with a link: `?room=CODE` auto-joins.

## Controls

- **Keyboard:** ← → move · ↑ / space rotate · ↓ soft drop · R reset
- **Touch:** on-screen buttons (shown on touch devices)

## Development

```sh
npm install
npm run dev       # Vite dev server
npm run build     # production build -> docs/ (for GitHub Pages)
npm run preview   # preview the production build
```

## Stack

- [Vite](https://vitejs.dev/) bundler
- [rough.js](https://roughjs.com/) canvas rendering
- [Trystero](https://github.com/dmotz/trystero) WebRTC P2P
