from pathlib import Path
import os
import subprocess
import tempfile
from docx.oxml.ns import qn

from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parent
DOCX_PATH = ROOT / "Gunjan_Kawale_Resume.docx"
PDF_PATH = ROOT / "Gunjan_Kawale_Resume.pdf"
SOFFICE = "/Users/gunjankawale/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/soffice"
GREEN = RGBColor(40, 83, 60)
DARK = RGBColor(31, 39, 34)
MUTED = RGBColor(83, 96, 88)


def set_font(style, name="Arial", size=9.2, color=DARK, bold=False):
    style.font.name = name
    style.font.size = Pt(size)
    style.font.color.rgb = color
    style.font.bold = bold


def add_section(doc, title):
    p = doc.add_paragraph(style="Resume Section")
    p.add_run(title.upper())
    return p


def add_skill(doc, label, value):
    p = doc.add_paragraph(style="Resume Body")
    run = p.add_run(label + ": ")
    run.bold = True
    p.add_run(value)


def add_job(doc, title, organization, dates, bullets):
    p = doc.add_paragraph(style="Resume Job")
    p.paragraph_format.tab_stops.add_tab_stop(Inches(7.34), WD_TAB_ALIGNMENT.RIGHT)
    r = p.add_run(title)
    r.bold = True
    p.add_run("\t" + dates)
    p.paragraph_format.keep_with_next = True

    p = doc.add_paragraph(style="Resume Organization")
    p.add_run(organization)
    p.paragraph_format.keep_with_next = True

    for bullet in bullets:
        p = doc.add_paragraph(style="Resume Bullet")
        p.add_run("• " + bullet)


doc = Document()
section = doc.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(0.52)
section.bottom_margin = Inches(0.52)
section.left_margin = Inches(0.58)
section.right_margin = Inches(0.58)

styles = doc.styles
normal = styles["Normal"]
set_font(normal, size=9.2)
normal.paragraph_format.space_after = Pt(0)
normal.paragraph_format.line_spacing = 1.03

title = styles["Title"]
set_font(title, size=22, color=DARK, bold=True)
title.paragraph_format.space_after = Pt(0)
title_ppr = title._element.get_or_add_pPr()
title_border = title_ppr.find(qn("w:pBdr"))
if title_border is not None:
    title_ppr.remove(title_border)

for style_name, size, color, bold, before, after in [
    ("Resume Tagline", 10, GREEN, True, 0, 3),
    ("Resume Contact", 8.2, MUTED, False, 0, 4),
    ("Resume Section", 10, GREEN, True, 7, 2),
    ("Resume Body", 8.8, DARK, False, 0, 1.3),
    ("Resume Job", 9.2, DARK, False, 3.5, 0),
    ("Resume Organization", 8.5, MUTED, False, 0, 1),
    ("Resume Bullet", 8.7, DARK, False, 0, 1.2),
]:
    style = styles.add_style(style_name, WD_STYLE_TYPE.PARAGRAPH)
    set_font(style, size=size, color=color, bold=bold)
    style.paragraph_format.space_before = Pt(before)
    style.paragraph_format.space_after = Pt(after)
    style.paragraph_format.line_spacing = 1.02

bullet_style = styles["Resume Bullet"]
bullet_style.paragraph_format.left_indent = Inches(0.16)
bullet_style.paragraph_format.first_line_indent = Inches(-0.13)
bullet_style.paragraph_format.keep_together = True

p = doc.add_paragraph(style="Title")
p.add_run("Gunjan Kawale")
p = doc.add_paragraph(style="Resume Tagline")
p.add_run("Data Engineer | SQL | ETL & Data Warehousing")
p = doc.add_paragraph(style="Resume Contact")
p.alignment = WD_ALIGN_PARAGRAPH.LEFT
p.add_run("Nagpur, Maharashtra, India  |  gunjanworkspace@gmail.com  |  linkedin.com/in/gunjan-kawale")

add_section(doc, "Professional Summary")
p = doc.add_paragraph(style="Resume Body")
p.add_run("Data Engineer with experience in SQL development, ETL, data warehousing, data migration, and workflow automation. Currently rebuilding production Redpoint workflows in Azure Logic Apps, with output reconciliation, SQL stored procedures, API integrations, and workflow monitoring.")

add_section(doc, "Technical Skills")
add_skill(doc, "ETL & Data Warehousing", "Redpoint, SSIS, ETL pipelines, data warehousing, data integration, data migration, data validation, output reconciliation")
add_skill(doc, "Cloud & Automation", "Azure Logic Apps, Azure Blob Storage, Azure Function App API integration, workflow automation")
add_skill(doc, "Databases", "SQL Server, Oracle SQL")
add_skill(doc, "Development", "SQL queries, stored procedures, query optimization, XML/JSON, CSV/TXT processing, debugging, workflow logging, error handling, testing")
add_skill(doc, "Tools", "Git, code reviews, Postman, log-tracking dashboards")

add_section(doc, "Professional Experience")
add_job(doc, "Data Engineer", "OneData Software Solutions | Client: Donnelley Financial Solutions (DFIN)", "Jun 2026 – Present", [
    "Migrated 7–8 existing production workflows from Redpoint to Azure Logic Apps, rebuilding workflow logic and reconciling outputs against Redpoint to preserve existing automation behavior.",
    "Built a file-triggered workflow that processes CSV files, applies business rules using SQL stored procedures, archives input files, and generates two TXT output files.",
    "Developed scheduled Azure Logic Apps workflows that call Azure Function App APIs and use Azure Blob Storage.",
    "Configured triggers, SQL actions, API payloads, and workflow steps, mapping SQL query results to workflow variables.",
    "Implemented workflow-level and step-level logging, dashboard error tracking, and email notifications; investigated SQL timeouts in long-running workflows.",
    "Tested workflows, used Git for version control and code reviews, and supported deployment, documentation, and post-release monitoring.",
])
add_job(doc, "Data Engineer", "Helson Software Solutions Pvt. Ltd.", "Jan 2025 – Mar 2026", [
    "Developed and optimized SQL queries for data extraction, transformation, and processing.",
    "Contributed to ETL processes supporting data integration and data warehouse operations.",
    "Supported data migrations, focusing on data consistency and accuracy during transfers between systems.",
])
add_job(doc, "ETL Developer", "OneData Software Solutions | Client: Donnelley Financial Solutions (DFIN)", "Jan 2023 – Dec 2024", [
    "Built new Redpoint ETL workflows based on project and business requirements.",
    "Enhanced existing Redpoint workflows by adding features and modifying workflow logic; maintained workflows for ongoing data processing requirements.",
    "Troubleshot workflow issues and validated expected results through testing.",
])
add_job(doc, "Associate – SQL DWH Development", "Think Analytics India Pvt. Ltd. (Think360)", "May 2021 – Nov 2022", [
    "Designed and maintained data integration solutions using SQL Server, SSIS, and ETL processes; optimized SQL queries for data processing and extraction.",
    "Supported data pipeline automation, data consistency, and data security.",
    "Contributed to data-driven client solutions, including work for ICICI Bank.",
])

add_section(doc, "Education")
add_skill(doc, "Diploma in Advanced Computing (DAC)", "C-DAC Sunbeam Institute of Information Technology, Pune | Apr 2021 | Grade A")
add_skill(doc, "B.E. in Computer Science Engineering", "Priyadarshini Institute of Engineering & Technology, Nagpur | RTM Nagpur University | 2019 | CGPA 6.48")

add_section(doc, "Additional Learning")
p = doc.add_paragraph(style="Resume Body")
p.add_run("ETL with Python & SQL, LinkedIn Learning (Jan 2026)  |  Databricks Fundamentals Accreditation (Jan 2026)")

doc.core_properties.title = "Gunjan Kawale Resume"
doc.core_properties.subject = "Data Engineer | SQL | ETL & Data Warehousing"
doc.core_properties.author = "Gunjan Kawale"
doc.save(DOCX_PATH)

with tempfile.TemporaryDirectory(prefix="gunjan-resume-lo-") as profile:
    env = os.environ.copy()
    env["HOME"] = profile
    env.setdefault("XDG_CONFIG_HOME", str(Path(profile) / "xdg_config"))
    env.setdefault("XDG_CACHE_HOME", str(Path(profile) / "xdg_cache"))
    Path(env["XDG_CONFIG_HOME"]).mkdir(parents=True, exist_ok=True)
    Path(env["XDG_CACHE_HOME"]).mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [SOFFICE, f"-env:UserInstallation={Path(profile).as_uri()}", "--invisible", "--headless", "--norestore", "--convert-to", "pdf", "--outdir", str(ROOT), str(DOCX_PATH)],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
    )

print(f"Created {DOCX_PATH} and {PDF_PATH}")
