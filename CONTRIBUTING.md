# Adding a new design skill

1. **Pick a name** that describes the look, not a brand: lowercase, hyphenated, e.g. `bold-brutalist-portfolio`,
   `soft-glass-dashboard`. Never name a skill after another company or product.
2. **Copy the template**

   ```bash
   cp -r templates/skill-template skills/<new-name>
   ```

3. **Write `SKILL.md`.** Keep the frontmatter `name` equal to the folder name. The `description` decides when Claude uses
   the skill: say what the style looks like and which requests should trigger it. Fill every section of the template;
   delete hints you don't need.
4. **Build the reference site** in `example/index.html`: one self-contained file (inline CSS/JS, Google Fonts only), with
   `<!doctype html>`, `<meta charset="utf-8">` and a viewport meta so it works on phones and on GitHub Pages.
5. **Put detailed code in `references/`** so `SKILL.md` stays short; link to it from `SKILL.md`.
6. **Screenshots** go in `screenshots/` as numbered PNGs (`01-hero.png`, …), desktop 1440×900 and mobile 390×844.
   `skills/paper-notebook-landing/scripts/screenshots.mjs` is a dependency-free starting point (Node 22+ and Chrome).
7. **Register the skill** in three places:
   - `.claude-plugin/marketplace.json`: add a plugin entry

     ```json
     {
       "name": "<new-name>",
       "description": "<one sentence>",
       "source": "./",
       "strict": false,
       "skills": ["./skills/<new-name>"]
     }
     ```

   - `README.md`: add a row to the Skills table.
   - `index.html`: add a card to the gallery.
8. **Check before pushing**
   - `claude plugin validate .` passes.
   - The example has no content you are not allowed to publish (client texts, phone numbers, photos).
   - No third-party logos, illustrations or copy.

## Rules for every skill

- Real content only in examples; mark sample people and data as examples.
- Accessible by default: visible focus, `prefers-reduced-motion`, alt text / `aria-label` for drawings.
- No horizontal scroll at 390px.
