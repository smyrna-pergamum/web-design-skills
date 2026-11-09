# Web Design Skills

A library of AI web design skills for Claude (Claude Code, Agent Skills). Each skill teaches the model one complete visual
style: the rules, the section patterns, the interactions and a finish checklist, plus a working reference site,
screenshots and copy-ready components.

**Gallery:** https://smyrna-pergamum.github.io/web-design-skills/

## Skills

| | Skill | Style | Demo |
|---|---|---|---|
| <img src="skills/paper-notebook-landing/screenshots/01-hero.png" width="260" alt="Paper notebook landing page"> | [**paper-notebook-landing**](skills/paper-notebook-landing) | Warm paper-notebook landing pages: cream paper, chunky soft serif, handwritten notes, sticky notes, a notebook that opens as you scroll, comic strips, giant footer. TR/EN/DE example. | [Live](https://smyrna-pergamum.github.io/web-design-skills/skills/paper-notebook-landing/example/) |
| <img src="skills/noir-gradient-law/screenshots/01-hero.png" width="260" alt="Noir gradient law firm website"> | [**noir-gradient-law**](skills/noir-gradient-law) | Law-firm and advisory sites: pure black, bronze statue photography, fire gradient (yellow → orange → red), giant uppercase headlines, duotone-halftone photos, 3D review carousel. EN/TR example. | [Live](https://smyrna-pergamum.github.io/web-design-skills/skills/noir-gradient-law/example/) |

## Install

### As a Claude Code plugin marketplace

```bash
/plugin marketplace add smyrna-pergamum/web-design-skills
/plugin install paper-notebook-landing@web-design-skills
```

Each skill is its own plugin, so you install only the styles you want.

### By copying a folder

Copy any folder from `skills/` into `~/.claude/skills/` (all projects) or `.claude/skills/` inside one project.

## Use

Ask for the style by what it looks like, or name the skill:

> Redesign https://example.com with the paper-notebook-landing skill. Keep all real content.

## Repository layout

```
web-design-skills/
├── .claude-plugin/marketplace.json   # one plugin entry per skill
├── index.html                        # gallery page (GitHub Pages)
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md                  # the skill itself (required)
│       ├── README.md                 # human-facing overview
│       ├── references/               # detailed component code
│       ├── example/index.html        # reference site
│       ├── screenshots/              # PNGs of every section
│       └── scripts/                  # helpers (e.g. screenshot capture)
├── templates/skill-template/         # starting point for a new skill
└── CONTRIBUTING.md                   # how to add a new design
```

## Add a new design

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: copy `templates/skill-template` to `skills/<new-name>`, fill in
`SKILL.md`, add an example and screenshots, then add one entry to `.claude-plugin/marketplace.json`, this README's table and
the gallery in `index.html`.

## License

[MIT](LICENSE) for code and documentation. Example content belongs to its owners (see each skill's README).
Fonts are loaded from Google Fonts under their own licenses.

---

### Türkçe özet

Web Design Skills, Claude için web tasarım skill'lerinden oluşan bir kütüphane. Her skill bir görsel tarzı baştan sona öğretir: kurallar, bölüm
kalıpları, etkileşimler, kontrol listesi, örnek site ve ekran görüntüleri. Kurulum:
`/plugin marketplace add smyrna-pergamum/web-design-skills`, ardından istediğiniz skill için `/plugin install <ad>@web-design-skills`.
Yeni tasarım eklemek için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakın.
