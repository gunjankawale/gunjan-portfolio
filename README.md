# Gunjan Kawale — Portfolio

Portfolio for Gunjan Kawale, Azure Data Engineer. The site is built with plain HTML, CSS, and JavaScript and has no package installation or build step. The design centers on a data-workflow diagram and a direct, scrollable overview of experience, outcomes, skills, and background.

## Preview locally

Open `index.html` in a browser. Use the navigation to move between experience, selected work, skills, and about sections.

## Files

- `index.html` — portfolio content and workflow illustration
- `styles.css` — responsive visual design and motion
- `script.js` — reading progress, current-section navigation, and reveal behavior
- `Gunjan_Kawale_Resume.pdf` — downloadable résumé (public copy with mobile number removed)
- `build_resume.py` — ReportLab source used to create the résumé PDF

## Deploy with GitHub Pages

The `Deploy to GitHub Pages` workflow publishes the static site on each push to `main`. The repository's Pages source is configured as **GitHub Actions**. The site will be available at `https://gunjankawale.github.io/gunjan-portfolio/` after the first successful workflow run.

GitHub CLI 2.102.0 is available locally at `.tools/bin/gh` for repository setup. The binary is ignored by Git and is not included in the source history.
