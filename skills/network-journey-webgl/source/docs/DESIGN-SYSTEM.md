# LANORA website design system

Concept: **Into Your Network.** One continuous WebGL world behind eight HTML chapters, structured after
igloo.inc's single-scene journey and HUD, in LANORA's forest-green and lime.

## Colour tokens (`src/app.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--void` | `#050a08` | deepest edge of the scene, vignette |
| `--bg` | `#080b09` | page background, WebGL clear colour |
| `--fog` | `#0e1b15` | 3D fog (the scene uses `#0b140f`) |
| `--surface` | `#111713` | panels, cards |
| `--forest` | `#173c33` | deep surfaces, logo tile (app colour) |
| `--green` | `#245b48` | connections, secondary glass (app colour) |
| `--primary` | `#2d7659` | active edges, rings (app colour) |
| `--lime` | `#c6eea3` | headings accent, buttons, HUD labels, focus ring (app colour) |
| `--signal` | `#a3ff12` | live states only: selected node, open port, gateway pulse. Under 3% of the screen |
| `--text` / `--secondary` / `--muted` | `#e6eee8` / `#d5e2d2` / `#8a948c` | text levels; muted passes AA on `--bg` |
| `--border` | `#27312a` | dividers, HUD lines |
| `--warning` | `#dc8b40` | medium finding (app colour) |
| `--critical` | `#ff4d4d` | high finding |
| `--paper` | `#f5f7f6` | reserved for report documents |

Severity is never colour alone: colour + word + icon, as in the app (FR17). An open port is not red.

## Type

- **Display:** Space Grotesk 700, uppercase, `letter-spacing: -0.04em`, line-height 0.9. Five words at most.
- **Body:** Inter 400–600, 16–18 px, about 44–60 characters a line.
- **Labels:** IBM Plex Mono 500, 11–13 px, uppercase, `letter-spacing: 0.08–0.14em`. IP, ports, versions, HUD.

## Materials (WebGL)

- Glass: `MeshStandardMaterial`, green, opacity 0.42, flat shading, lime edge lines.
- Light lines: `LineBasicMaterial`, additive blending, no depth write.
- Points: one soft round sprite (`dotTexture()`), additive. No constant flicker or pulsing except the gateway.

## HUD

- Corners: logo + `// local mode · 127.0.0.1` (top left), navigation (top right), chapter counter + progress
  (bottom right). Hint, Sound and Reduce motion sit bottom centre.
- Object labels: a 1 px leader line and a mono block. Labels are hidden over the text column, the header and
  the bottom HUD. Clickable labels are real buttons.
- Bracket selector `[ PDF ]` for any one-of-many choice.
- Mono labels "decode" with a short scramble when their chapter becomes current (not in the Static tier).

## Motion rules

- Everything follows one scroll value. Each chapter spends its first 22% flying from the previous chapter's end
  to its own start; a scanline overlay shows during that flight.
- Sound is off by default and starts only from the visitor's click.
- Reduce motion (system setting or the HUD switch) turns the scene off and shows stills.

## Content rules

- Use only claims that the LANORA README, release notes or source support. Never "100% local", "never connects",
  "finds all vulnerabilities", "audited", "enterprise", "real-time monitoring", or roadmap items as features.
- The local-first section says exactly: the interface listens only on 127.0.0.1; no account, cloud or telemetry;
  data in `%LOCALAPPDATA%\Lanora`. It also says scanning sends probes to the addresses you choose.
- Sample devices, ports and scores are labelled "Sample data".
- The "not code-signed, SmartScreen may warn, check SHA256SUMS.txt" note stays next to the download.
