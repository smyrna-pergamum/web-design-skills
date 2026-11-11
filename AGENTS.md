# Instructions for AI coding agents

This repository is a library of web design skills in the open Agent Skills format. It is meant for any coding agent
(Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Gemini CLI, Aider, Cline and others).

## Using a skill

- Every style lives in `skills/<name>/`. Read `SKILL.md` first and follow it; it lists the visual rules, section
  patterns, effects, build rules and a finish checklist.
- Take code from `references/components.md` and the working reference in `example/index.html`.
- Pick the skill whose `description` (front matter of `SKILL.md`) matches the request. If the user names a skill, use it.
- Keep the user's real content. Never invent prices, statistics, testimonials or legal claims; mark example data.

## Adding or changing a skill

Follow `CONTRIBUTING.md`: folder name = `name` in the front matter, a self-contained example, numbered screenshots
(1440×900 and 390×844), and register the skill in `.claude-plugin/marketplace.json`, the table in `README.md` and the
gallery in `index.html`.
