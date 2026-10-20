# Gunjan Kawale — Data Engineering Showcase

A static engineering portfolio built with HTML, CSS, JavaScript and local SVGs. It explains workflow architecture and three sanitized professional examples. The pages do not execute Azure workflows, call APIs, access databases or send email. Hosting uses GitHub Pages with no required paid services or build dependencies.

## Site structure

- **Home** — concise introduction, animated system map, professional profile links and résumé PDF.
- **Workflow Architecture & Reliability** — two separate diagrams: Redpoint migration and output reconciliation, then the shared Logic Apps Try/Catch wrapper and dashboard status tracking. It is an overview, not a numbered case study.
- **API Reporting Pipeline animation** — an eight-scene GSAP simulation embedded in the API reporting case study, with dynamic payload assembly, API transit, separate Function App processing, CSV storage, PASS/FAIL branches and delivery or failure handling.
- **Case Study 1 — API-Driven Reporting** — one migrated Logic Apps workflow calling a Function App API; Function App report generation and Blob storage are distinct from Logic Apps status evaluation and downstream orchestration.
- **Case Study 2 — New CSV Processing** — a workflow built from scratch for a fresh requirement, applying SQL stored procedures and producing TXT output.
- **Case Study 3 — Database-Driven File Routing** — routing locations and email recipients are read from database configuration for TXT/PDF file handling.
- **Technology Stack** — skills grouped by function and work context.
- **Background** — compact, verified career chronology and education.
- **Contact** — professional email, GitHub, LinkedIn and résumé download.

## Interactive SVG diagrams

The system map and architecture diagrams use local SVG fallbacks. The API Reporting case study includes a simulated, eight-scene GSAP animation rendered with HTML and CSS. Its controls support Start, Play, Pause, Previous, Next, Replay, branch selection and a full workflow view. The simulation never calls a real API or cloud service. It loads a pinned GSAP build from jsDelivr; if that CDN is unavailable or reduced motion is requested, the technical explanation and manual scene navigation remain available without animation.

The six desktop diagram families are:

- `hero-system-map.svg` — systems and formats overview.
- `case-redpoint-migration.svg` — legacy and migrated workflow comparison with output reconciliation.
- `workflow-architecture.svg` — shared Try/Catch wrapper and workflow-status logging.
- `api-reporting.svg` — one migrated API report workflow with distinct status branches.
- `csv-processing.svg` — new CSV-to-TXT process.
- `file-routing.svg` — database-configured TXT/PDF routing and notification.

Each has a separate mobile layout: `hero-system-map-mobile.svg`, `case-redpoint-migration-mobile.svg`, `architecture-wrapper-mobile.svg`, `api-reporting-mobile.svg`, `csv-processing-mobile.svg` and `file-routing-mobile.svg`. The static fallback and explanatory HTML keep the essential content available without animation. SVG files contain no internal endpoints, customer data, database object names, private paths, credentials or internal report counts.

## Files

- `index.html` — portfolio structure and static explanations.
- `projects/api-reporting.html`, `projects/csv-processing.html`, `projects/file-routing.html` — detailed case studies.
- `styles.css` — editorial visual system, responsive layouts, focus states and reduced-motion styles.
- `script.js` — existing diagram controls, active section state, reading progress and footer year.
- `api-reporting.js` — the API case-study animation and scene controls.
- `assets/diagrams/` — six original desktop SVGs and mobile counterparts.
- `favicon.svg`, `social-preview.svg`, `social-preview.png` — local identity and share-preview assets.
- `Gunjan_Kawale_Resume.pdf` — public résumé download linked from the site.
- `Gunjan_Kawale_Resume.docx` — editable local file; it is not included in the Pages artifact. The worktree retains it while Git has a staged untracking change; the public source repository will retain its earlier tracked copy until that change is committed and pushed.
- `build_resume.py` — résumé-generation helper; not staged for the website.
- `.github/workflows/deploy.yml` — GitHub Pages deployment workflow.

The PDF document properties include the résumé title and author name. The DOCX core properties include the author and last-modified-by fields. Both were reviewed read-only. The site links only to the PDF; it does not publish or link to the editable DOCX in the Pages artifact.

## Preview locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Serving over HTTP allows the browser to load the local SVG files into the animation controls. If JavaScript is disabled, the static diagrams and text remain available.

## GitHub Pages deployment

The `Deploy to GitHub Pages` workflow runs on pushes to `main` or manual dispatch. It copies only the home page, shared CSS/JavaScript, favicon, share image, intended résumé PDF, twelve required SVG files and the three case-study pages into `_site/`, then uploads that folder as the Pages artifact. It does not include the résumé DOCX, build helper, repository files, unused legacy draft pages or video files. No runtime API, database, backend or paid service is required.

The configured site address is [gunjankawale.github.io/gunjan-portfolio](https://gunjankawale.github.io/gunjan-portfolio/). A successful workflow run is required for changes to appear there.

## Review checklist

- Visit the home page and each case-study route under the repository subpath.
- Check section navigation, case-study links, résumé downloads, email, GitHub and LinkedIn.
- Use the API case study's Start, Play, Pause, Previous, Next, Replay and full-workflow controls by keyboard and pointer; check both business-status paths, reduced motion, and fallback behavior when GSAP is unavailable.
- Review wide, tablet and narrow layouts, including the static mobile diagram alternatives.
- Confirm no public workflow trigger, live API call, database connection or paid asset dependency is introduced.
- Confirm the Pages artifact stages only the intended public files.
