This folder contains a vendored snapshot of the static PokéMMO Damage Calculator from c4vv/pokemmo-damage-calc (the GitHub Pages/docs distribution).

Notes
- Files are copied as-is into `public/pokemmo-damage-calc/` so they are served at `/pokemmo-damage-calc/*`.
- Paths in the original `index.html` already use relative links. If future versions use absolute root paths, rewrite them to relative so they work under `/pokemmo-damage-calc/`.

How to update
1) Replace the entire contents of this folder with the latest built static site (from the repo's `docs`/pages output).
2) Keep the folder name and structure the same so `/pokemmo-damage-calc/index.html` loads.
3) Do not edit upstream files except for path fixes if necessary.

Troubleshooting
- If assets fail to load, open browser devtools and confirm paths resolve under `/pokemmo-damage-calc/`.
- Ensure no mixed-content or cross-origin requests; the iframe is sandboxed.


