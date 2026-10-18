"""Remove the contact phone from the editable resume and refresh its PDF copy."""

from pathlib import Path
import os
import re
import shutil
import subprocess
import tempfile

from docx import Document


ROOT = Path(__file__).resolve().parent
DOCX_PATH = ROOT / "Gunjan_Kawale_Resume.docx"
PDF_PATH = ROOT / "Gunjan_Kawale_Resume.pdf"
SOFFICE = "/Users/gunjankawale/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/soffice"
PHONE = re.compile(r"(?<!\d)(?:\+?91[ -]?)?\d{10}(?!\d)")


doc = Document(DOCX_PATH)
removed = 0
for paragraph in doc.paragraphs:
    for run in paragraph.runs:
        if PHONE.search(run.text):
            run.text, count = re.subn(r"\s*\|\s*" + PHONE.pattern, "", run.text, count=1)
            removed += count

if removed > 1:
    raise RuntimeError(f"Expected at most one phone number, found {removed}.")

doc.save(DOCX_PATH)

with tempfile.TemporaryDirectory(prefix="gunjan-resume-export-") as temp_root:
    profile = Path(temp_root) / "profile"
    output = Path(temp_root) / "output"
    profile.mkdir()
    output.mkdir()
    env = os.environ.copy()
    env["HOME"] = str(profile)
    env.setdefault("XDG_CONFIG_HOME", str(profile / "xdg_config"))
    env.setdefault("XDG_CACHE_HOME", str(profile / "xdg_cache"))
    Path(env["XDG_CONFIG_HOME"]).mkdir(parents=True, exist_ok=True)
    Path(env["XDG_CACHE_HOME"]).mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            SOFFICE,
            f"-env:UserInstallation={profile.as_uri()}",
            "--invisible",
            "--headless",
            "--norestore",
            "--convert-to",
            "pdf",
            "--outdir",
            str(output),
            str(DOCX_PATH),
        ],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
    )
    generated_pdf = output / f"{DOCX_PATH.stem}.pdf"
    if not generated_pdf.exists() or generated_pdf.stat().st_size == 0:
        raise RuntimeError("PDF export did not produce a non-empty file.")
    shutil.copy2(generated_pdf, PDF_PATH)

print(f"Phone number removed ({removed} match(es)); DOCX and PDF refreshed.")
