# Gunjan Kawale — Portfolio

Portfolio for Gunjan Kawale, Data Engineer. The site is built with plain HTML, CSS, and JavaScript and has no package installation or build step. It presents SQL, ETL, data warehousing, workflow migration, selected workflow examples, skills, and education from the current résumé.

## Preview locally

Open `index.html` in a browser. Use the navigation to move between experience, selected work, skills, and about sections.

## Files

- `index.html` — portfolio content and workflow illustration
- `styles.css` — responsive visual design and motion
- `script.js` — reading progress, current-section navigation, and reveal behavior
- `Gunjan_Kawale_Resume.pdf` — downloadable résumé with the phone number removed
- `build_resume.py` — removes the phone number from the local editable DOCX and exports the matching PDF; the DOCX is not included in the public repository

## Deploy with GitHub Pages

The `Deploy to GitHub Pages` workflow publishes the static site on each push to `main`. The repository's Pages source is configured as **GitHub Actions**. The site will be available at `https://gunjankawale.github.io/gunjan-portfolio/` after the first successful workflow run.

GitHub CLI 2.102.0 is available locally at `.tools/bin/gh` for repository setup. The binary is ignored by Git and is not included in the source history.
