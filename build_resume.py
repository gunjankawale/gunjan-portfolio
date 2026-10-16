from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether

OUT = 'Gunjan_Kawale_Resume.pdf'
green = colors.HexColor('#315b43')
dark = colors.HexColor('#202923')
muted = colors.HexColor('#626b63')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Name', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=23, leading=26, textColor=dark, alignment=TA_LEFT, spaceAfter=2))
styles.add(ParagraphStyle(name='Role', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.2, leading=13, textColor=green, spaceAfter=5))
styles.add(ParagraphStyle(name='Contact', parent=styles['Normal'], fontSize=8.3, leading=11, textColor=muted))
styles.add(ParagraphStyle(name='SectionX', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=green, spaceBefore=8, spaceAfter=4, keepWithNext=True))
styles.add(ParagraphStyle(name='BodyX', parent=styles['BodyText'], fontSize=8.4, leading=11.2, textColor=dark, spaceAfter=3))
styles.add(ParagraphStyle(name='Job', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=dark, spaceBefore=4, spaceAfter=1, keepWithNext=True))
styles.add(ParagraphStyle(name='Date', parent=styles['Normal'], fontSize=8, leading=10, textColor=muted, alignment=2))
styles.add(ParagraphStyle(name='BulletX', parent=styles['BodyX'], leftIndent=9, firstLineIndent=-7, spaceAfter=2))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#d8ded7'))
    canvas.line(doc.leftMargin, 0.48*inch, letter[0]-doc.rightMargin, 0.48*inch)
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(muted)
    canvas.drawString(doc.leftMargin, 0.31*inch, 'GUNJAN KAWALE  |  DATA ENGINEER')
    canvas.drawRightString(letter[0]-doc.rightMargin, 0.31*inch, str(doc.page))
    canvas.restoreState()

doc = SimpleDocTemplate(OUT, pagesize=letter, rightMargin=.62*inch, leftMargin=.62*inch, topMargin=.48*inch, bottomMargin=.62*inch, title='Gunjan Kawale - Data Engineer Resume', author='Gunjan Kawale')
story = [Paragraph('GUNJAN KAWALE', styles['Name']), Paragraph('AZURE DATA ENGINEER  |  DATA PIPELINES &amp; CLOUD WORKFLOWS', styles['Role']), Paragraph('gunjanworkspace@gmail.com  ·  Nagpur, Maharashtra  ·  linkedin.com/in/gunjan-kawale', styles['Contact'])]
story += [Paragraph('PROFILE', styles['SectionX']), Paragraph('Data Engineer with 4+ years of experience developing ETL/ELT pipelines, cloud-ready warehouse solutions, data migrations, and workflow automation. Currently migrating Redpoint projects to Azure, building Logic Apps workflows, and maintaining wiki documentation with AI assistance. Experienced in processing 10M+ daily records, improving pipeline performance, and implementing validation and reconciliation practices.', styles['BodyX'])]
story += [Paragraph('CORE SKILLS', styles['SectionX']), Paragraph('<b>Data Engineering:</b> SQL, ETL/ELT, incremental and delta loads, SCD Type 2, dimensional modelling, data warehousing<br/><b>Cloud &amp; Workflow:</b> Microsoft Azure, Logic Apps, Redpoint, SSIS, workflow orchestration, REST APIs<br/><b>Quality &amp; Governance:</b> Reconciliation, audit tracking, data validation, anomaly detection, regulatory reporting<br/><b>Data Formats &amp; Tools:</b> JSON, CSV, SQL Server, SSMS, Git<br/><b>Developing:</b> Python', styles['BodyX'])]

def job(title, company, location, dates, bullets):
    organization = f'{company} · {location}' if location else company
    head = Table([[Paragraph(f'{title}  |  {organization}', styles['Job']), Paragraph(dates, styles['Date'])]], colWidths=[5.65*inch, 1.55*inch])
    head.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
    group = [head]
    group.extend(Paragraph('• ' + bullet, styles['BulletX']) for bullet in bullets)
    return KeepTogether(group)

story.append(Paragraph('PROFESSIONAL EXPERIENCE', styles['SectionX']))
story.append(job('Azure Data Engineer', 'OneData', '', 'Jun 2026 – Present', [
    'Migrate existing data projects from Redpoint to Azure and develop new workflow automations using Azure Logic Apps.',
    'Create and maintain wiki documentation for migrated workflows, using AI to support documentation upkeep.'
]))
story.append(job('Data Engineer', 'Helson Software Solutions Pvt. Ltd.', 'Hyderabad', 'Jan 2025 – Mar 2026', [
    'Designed SQL-based ETL/ELT pipelines processing 10M+ daily records with zero data loss across structured and semi-structured sources.',
    'Engineered incremental and delta load frameworks that reduced pipeline runtime by 35–40%.',
    'Implemented monitoring, alerting, retries, and failure recovery, achieving 99.9% SLA compliance; added reconciliation and validation that reduced downstream reporting defects by 30%.',
    'Improved analytical query speed by approximately 25% through indexing, partitioning, and data model tuning.'
]))
story.append(job('Data Engineer / ETL Developer', 'Donnelley Financial Solutions', 'Coimbatore', 'Jan 2023 – Dec 2024', [
    'Integrated REST APIs, JSON, and CSV sources into relational data warehouses for batch and analytics use cases.',
    'Implemented audit tracking and data aging logic to support financial data governance and compliance reporting.',
    'Built reusable ETL templates that reduced onboarding time for new data sources by 25%; collaborated on dimensional models for BI reporting.'
]))
story.append(job('Data Engineer', 'Think360.ai', 'Mumbai', 'May 2021 – Nov 2022', [
    'Migrated 5TB+ of production datasets with SQL validation scripts, achieving near-zero downtime.',
    'Automated SSIS and SQL batch ingestion, reducing manual operational effort by 20%; improved retrieval performance by 28% through partitioning, indexing, and query optimization.'
]))
story += [Paragraph('EDUCATION', styles['SectionX']), Paragraph('<b>Post Graduate Diploma in Advanced Computing</b> · Sunbeam Institute of Information Technology, Pune · 2020–2021<br/><b>Bachelor of Engineering in Computer Science</b> · Priyadarshini Institute of Engineering &amp; Technology, Nagpur · 2015–2019', styles['BodyX'])]
story += [Paragraph('CERTIFICATIONS', styles['SectionX']), Paragraph('Databricks Fundamentals Accreditation (Jan 2026)  ·  ETL in Python and SQL, LinkedIn Learning (Jan 2026)', styles['BodyX'])]
doc.build(story, onFirstPage=footer, onLaterPages=footer)
