# Gunjan Kawale — Portfolio

Portfolio for Gunjan Kawale, Azure Data Engineer. The site is built with plain HTML, CSS, and JavaScript and has no package installation or build step. It uses a scroll-first layout, with an optional interactive hero illustration.

## Preview locally

Open `index.html` in a browser. The main sections are available by scrolling or using the navigation. The hero illustration's stations jump to the related sections; arrow keys or WASD can optionally move the character while the illustration is focused.

## Files

- `index.html` — portfolio content and interactive room
- `styles.css` — responsive layout, game environment, and motion
- `script.js` — movement, station navigation, and accessibility behavior
- `Gunjan_Kawale_Resume.pdf` — downloadable résumé (public copy with mobile number removed)
- `build_resume.py` — ReportLab source used to create the résumé PDF

## Deploy with GitHub Pages

The `Deploy to GitHub Pages` workflow publishes the static site on each push to `main`. The repository's Pages source is configured as **GitHub Actions**. The site will be available at `https://gunjankawale.github.io/gunjan-portfolio/` after the first successful workflow run.

GitHub CLI 2.102.0 is available locally at `.tools/bin/gh` for repository setup. The binary is ignored by Git and is not included in the source history.
