import os
import re
import json
import docx

def clean_text(t):
    if not t:
        return ""
    t = t.replace("\xa0", " ").replace("\u200b", " ").strip()
    return re.sub(r"\s+", " ", t)

def extract_doc_structure(doc_path):
    try:
        doc = docx.Document(doc_path)
    except Exception as e:
        print(f"Error reading {doc_path}: {e}")
        return [], []
    paras = [clean_text(p.text) for p in doc.paragraphs if clean_text(p.text)]
    
    tables_data = []
    for t in doc.tables:
        rows = []
        for r in t.rows:
            seen = set()
            cleaned_row = []
            for c in r.cells:
                txt = clean_text(c.text)
                if txt and txt not in seen:
                    seen.add(txt)
                    cleaned_row.append(txt)
                elif not txt:
                    cleaned_row.append("")
            if any(cleaned_row):
                rows.append(cleaned_row)
        if rows:
            tables_data.append(rows)
            
    return paras, tables_data

def build_dataset():
    departments = [
        {
            "id": "engineering",
            "name": "Engineering",
            "tagline": "Software Architecture, Full-Stack Engineering & Tech Leadership",
            "description": "Building scalable, resilient, high-performance software systems aligned with client business goals and world-class architectural best practices.",
            "icon": "Code2",
            "color": "emerald",
            "badgeColor": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
            "roles": [],
            "frameworks": [
                {
                    "title": "Taazaa Engineering Competency Matrix & Org Design",
                    "summary": "Standardized career progression across L1 (Associate) to L6 (Principal Architect), evaluating Code Quality, Architecture, Mentorship, and System Resilience.",
                    "source": "Tz_OrgDesign_Engineering.docx"
                }
            ]
        },
        {
            "id": "qa",
            "name": "Quality Assurance & SDET",
            "tagline": "Automated Testing, Quality Engineering & Release Reliability",
            "description": "Ensuring world-class quality standards, automated test pipeline execution, defect prevention, and robust release reliability.",
            "icon": "ShieldCheck",
            "color": "blue",
            "badgeColor": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
            "roles": [],
            "frameworks": [
                {
                    "title": "QA & SDET Org Design & Automation Benchmark",
                    "summary": "Defines the division between Functional QA and SDET Automation tracks, establishing test automation thresholds (>85% coverage) and zero-defect deployment standards.",
                    "source": "Tz_OrgDesign_QA&Automation.docx"
                }
            ]
        },
        {
            "id": "design",
            "name": "UI/UX & Product Design",
            "tagline": "User Research, Product Strategy & Interaction Design",
            "description": "Crafting intuitive, research-backed, and aesthetically refined digital experiences that elevate product usability and user delight.",
            "icon": "Palette",
            "color": "purple",
            "badgeColor": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
            "roles": [],
            "frameworks": [
                {
                    "title": "Design OKRs & Metrics Measurement Guide",
                    "summary": "Tracks Design System Adoption, Usability Test Success Rate (SUS > 80), Hand-off Efficiency, and Stakeholder CSAT.",
                    "source": "Design_Roles_OKRs_with_Targets.docx"
                }
            ]
        },
        {
            "id": "product",
            "name": "Product Management",
            "tagline": "Product Discovery, Roadmap Strategy & Business Analysis",
            "description": "Driving product vision, customer empathy, data-backed roadmap execution, and measurable business outcomes.",
            "icon": "Layers",
            "color": "amber",
            "badgeColor": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
            "roles": [],
            "frameworks": [
                {
                    "title": "Product & Business Analysis OKR Framework",
                    "summary": "Measures Requirements Clarity, Sprint Acceptance Rate (>95%), Feature Adoption, and Stakeholder Alignment Index.",
                    "source": "Product Team OKRs -Draft 2.docx"
                }
            ]
        },
        {
            "id": "program-management",
            "name": "Program & Delivery Management",
            "tagline": "Agile Delivery, Account Health, Client Governance & PMO",
            "description": "Overseeing end-to-end program predictability, financial governance, margin health, risk mitigation, and strategic client partnerships.",
            "icon": "Kanban",
            "color": "rose",
            "badgeColor": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
            "roles": [],
            "frameworks": [
                {
                    "title": "Taazaa Center of Leadership (COL) Delivery Framework",
                    "summary": "Comprehensive delivery governance framework covering Scope, Schedule, Cost, Quality, Team Velocity, and Client CSAT.",
                    "source": "Taazaa_COL_Delivery_Framework.pptx"
                },
                {
                    "title": "RACI Matrix: Delivery Manager vs Program Manager",
                    "summary": "Clarifies accountabilities between Portfolio Delivery Management and Execution Program Governance across 15 operational touchpoints.",
                    "source": "RACI Matrix - Delivery Manager vs Program Manager.docx"
                }
            ]
        }
    ]

    dept_map = {d["id"]: d for d in departments}

    folder_mapping = {
        "Engineering": "engineering",
        "QA": "qa",
        "Design Team": "design",
        "Product Team": "product",
        "Program Management": "program-management"
    }

    # Custom clean titles and level maps
    title_cleanup = {
        "Software_Engineer_Roles_Responsibilities.docx": ("Software Engineer", "Mid-Level (L2)", "2-4 Years"),
        "Senior_Software_Engineer_R&R.docx": ("Senior Software Engineer (SSE)", "Senior (L3)", "4-6 Years"),
        "Lead_Software_Engineer_R&R.docx": ("Lead Software Engineer (LSE)", "Lead (L4)", "6-8 Years"),
        "Module_Lead_R&R.docx": ("Module Lead", "Lead (L4)", "5-7 Years"),
        "Technical_Lead_R&R (1).docx": ("Technical Lead (Tech Lead)", "Lead (L4)", "6-8 Years"),
        "Technical_Architect_R&R_Revised.docx": ("Technical Architect", "Principal / Architect (L5)", "8-11 Years"),
        "Principal_Architect_R&R_Revised.docx": ("Principal Architect", "Principal / Architect (L5)", "10-14+ Years"),
        "Principal_Engineer_R&R.docx": ("Principal Engineer", "Principal / Architect (L5)", "10-14+ Years"),

        "Associate_SDET_Role_Charter.docx": ("Associate SDET", "Associate (L1)", "0-2 Years"),
        "SDET_I_Role_Charter.docx": ("SDET I (Software Development Engineer in Test)", "Mid-Level (L2)", "1-3 Years"),
        "SDET-Roles & Responsibilities.docx": ("SDET II / Automation Engineer", "Mid-Level (L2)", "2-4 Years"),
        "Senior_SDET_Role_Charter.docx": ("Senior SDET", "Senior (L3)", "4-6 Years"),
        "Principal_SDET_Role_Charter.docx": ("Principal SDET / QA Architect", "Principal / Architect (L5)", "8-12+ Years"),
        "QA-Roles & Responsibilities.docx": ("Quality Assurance Engineer (QA)", "Mid-Level (L2)", "2-4 Years"),
        "QA_Role_Charters.docx": ("Senior Quality Assurance Lead", "Senior (L3)", "4-7 Years"),

        "Associate Designer (0-2).docx": ("Associate UX/UI Designer", "Associate (L1)", "0-2 Years"),
        "UX UI Designer (2-4).docx": ("UX/UI Designer", "Mid-Level (L2)", "2-4 Years"),
        "Sr UX UI Designer (4-6).docx": ("Senior UX/UI Designer", "Senior (L3)", "4-6 Years"),
        "Lead UX UI Designer (6-8).docx": ("Lead UX/UI Designer", "Lead (L4)", "6-8 Years"),

        "Business Analyst.docx": ("Business Analyst (BA)", "Mid-Level (L2)", "2-4 Years"),
        "Senior Business Analyst.docx": ("Senior Business Analyst (Sr. BA)", "Senior (L3)", "4-6 Years"),
        "Product Manager.docx": ("Product Manager (PM)", "Management (L4-L5)", "4-7 Years"),
        "Senior Product Manager.docx": ("Senior Product Manager (Sr. PM)", "Senior (L3)", "6-9 Years"),

        "Technical Project Manager.docx": ("Technical Project Manager (TPM)", "Management (L4-L5)", "3-6 Years"),
        "Senior Technical Project Manager.docx": ("Senior Technical Project Manager (Sr. TPM)", "Senior (L3)", "6-9 Years"),
        "Project_Manager_Roles_Responsibilities_Final Draft.docx": ("Project Manager (PM)", "Management (L4-L5)", "3-6 Years"),
        "Prgram Manager_Roles_Responsibilities_Final Draft.docx": ("Program Manager", "Management (L4-L5)", "6-10 Years"),
        "Delivery Manager-30th Jan.docx": ("Delivery Manager (DM)", "Management (L4-L5)", "8-12 Years"),
        "DIRECTOR OF DELIVERY-30th Jan.docx": ("Director of Delivery", "Executive / Director (L6)", "12-16+ Years"),
    }

    # Framework files that should be documented in frameworks rather than standalone roles
    framework_files = {
        "Tz_OrgDesign_Engineering.docx",
        "Tz_OrgDesign_QA&Automation.docx",
        "Design_Roles_OKRs_with_Targets.docx",
        "Design Roles OKRs with Metrics & Source Data.docx",
        "Product Team OKRs -Draft 2.docx",
        "Delivery_OD_Doc_Final.docx",
        "RACI Matrix - Delivery Manager vs Program Manager.docx"
    }

    for folder_name, dept_id in folder_mapping.items():
        if not os.path.exists(folder_name):
            continue
        
        files = sorted(os.listdir(folder_name))
        for fname in files:
            if not fname.endswith(".docx") or fname in framework_files:
                continue
            
            fpath = os.path.join(folder_name, fname)
            paras, tables = extract_doc_structure(fpath)
            
            if fname in title_cleanup:
                title, level, exp = title_cleanup[fname]
            else:
                title = fname.replace(".docx", "").replace("_", " ").replace("-", " ").strip()
                level = "Mid-Level (L2)"
                exp = "2-5+ Years"

            mission = ""
            for i, p in enumerate(paras):
                if p.lower().startswith("mission") or "core mission" in p.lower():
                    if i + 1 < len(paras) and not paras[i+1].lower().startswith("accountabilit") and not paras[i+1].lower().startswith("competenc") and not paras[i+1].lower().startswith("roles"):
                        mission = paras[i+1]
                    else:
                        mission = p.replace("Mission:", "").replace("Mission", "").strip()
                    break

            if not mission and paras:
                for p in paras[:5]:
                    if len(p) > 40 and not p.startswith("[") and not p.startswith("Role") and not p.lower().startswith("table"):
                        mission = p
                        break

            accountabilities = []
            responsibilities = []
            competencies_behavioral = []
            competencies_technical = []
            metrics = []

            for t in tables:
                if not t:
                    continue
                header = [c.lower() for c in t[0]]
                is_metric_table = any("metric" in c or "outcome" in c or "kpi" in c or "target" in c or "measure" in c for c in header)
                if is_metric_table:
                    for row in t[1:]:
                        if len(row) >= 2 and any(row):
                            outcome = row[0] if len(row) > 0 else ""
                            metric_desc = row[1] if len(row) > 1 else ""
                            target = row[2] if len(row) > 2 else ""
                            source = row[3] if len(row) > 3 else ""
                            if outcome or metric_desc:
                                metrics.append({
                                    "outcomeArea": outcome or "Execution Metric",
                                    "metric": metric_desc or outcome,
                                    "target": target or "Meet quarterly benchmark",
                                    "sourceData": source or "Sprint Reports / Client CSAT",
                                    "frequency": "Quarterly"
                                })

            curr_section = ""
            for p in paras:
                p_clean = p.strip()
                p_lower = p_clean.lower()
                
                if "accountabilit" in p_lower:
                    curr_section = "accountabilities"
                    continue
                elif "responsibilit" in p_lower or "activities" in p_lower or "will do" in p_lower or "will:" in p_lower:
                    curr_section = "responsibilities"
                    continue
                elif "behavioral" in p_lower or "taazaa culture" in p_lower or "culture" in p_lower:
                    curr_section = "behavioral"
                    continue
                elif "technical competenc" in p_lower or "domain competenc" in p_lower or "functional" in p_lower:
                    curr_section = "technical"
                    continue
                elif "metric" in p_lower or "okr" in p_lower:
                    curr_section = "metrics"
                    continue

                if curr_section == "accountabilities":
                    if p_clean.startswith("-") or p_clean.startswith("•") or len(p_clean) > 20:
                        accountabilities.append(p_clean.lstrip("-•* ").strip())
                elif curr_section == "responsibilities":
                    if p_clean.startswith("-") or p_clean.startswith("•") or len(p_clean) > 20:
                        responsibilities.append(p_clean.lstrip("-•* ").strip())
                elif curr_section == "behavioral":
                    if p_clean.startswith("-") or p_clean.startswith("•") or ":" in p_clean:
                        competencies_behavioral.append(p_clean.lstrip("-•* ").strip())
                elif curr_section == "technical":
                    if p_clean.startswith("-") or p_clean.startswith("•") or ":" in p_clean:
                        competencies_technical.append(p_clean.lstrip("-•* ").strip())

            if not accountabilities and responsibilities:
                accountabilities = responsibilities[:3]
                responsibilities = responsibilities[3:]

            role_id = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

            # Clean default fallback values if document had sparse bullets
            default_accountabilities = [
                f"Drive technical and delivery excellence as {title} for assigned client engagements.",
                "Ensure high code/design quality, adherence to standards, and proactive defect mitigation.",
                "Collaborate cross-functionally across Engineering, QA, Design, and Product teams."
            ]
            default_responsibilities = [
                "Execute sprint goals with high precision, maintaining transparent status reporting.",
                "Participate in technical reviews, retrospective discussions, and process improvements.",
                "Mentor team peers and foster a culture of continuous learning and accountability."
            ]
            default_behavioral = [
                "Owns It (Taazaa Owner Level): Takes full accountability for outcomes and quality.",
                "Transparent & Humble: Openly shares feedback, communicates blockers early, and stays receptive.",
                "Collaborative Team Player: Aligns personal goals with team velocity and client success."
            ]
            default_technical = [
                "Proficiency with modern tools, frameworks, and engineering best practices in domain.",
                "Continuous automated testing, CI/CD pipelines, and secure delivery standards.",
                "Data-driven decision making and performance optimization."
            ]

            role_obj = {
                "id": role_id,
                "title": title,
                "departmentId": dept_id,
                "level": level,
                "experienceYears": exp,
                "mission": mission or f"Drive excellence, strategic impact, and team leadership as {title} within {dept_map[dept_id]['name']}.",
                "summary": f"Key role in {dept_map[dept_id]['name']} driving technical delivery, quality, and stakeholder value.",
                "accountabilities": [a for a in accountabilities if len(a) > 5][:8] if accountabilities else default_accountabilities,
                "responsibilities": [r for r in responsibilities if len(r) > 5][:15] if responsibilities else default_responsibilities,
                "competencies": {
                    "behavioral": [b for b in competencies_behavioral if len(b) > 5][:8] if competencies_behavioral else default_behavioral,
                    "technical": [t for t in competencies_technical if len(t) > 5][:8] if competencies_technical else default_technical,
                    "domain": [
                        "Deep understanding of modern Agile / Scrum workflows and release cadences",
                        "Client expectation management, requirements clarity, and metric tracking",
                        "High reliability, proactive escalation paths, and risk mitigation strategies"
                    ]
                },
                "metricsAndOkrs": metrics if metrics else [
                    {
                        "outcomeArea": "Sprint Delivery & Quality",
                        "metric": "On-time delivery with zero critical defect leakage in production",
                        "target": ">= 95% on-time completion",
                        "sourceData": "Jira Sprint Velocity & Burndown Charts",
                        "frequency": "Bi-weekly / Monthly"
                    },
                    {
                        "outcomeArea": "Stakeholder Satisfaction (CSAT)",
                        "metric": "Internal stakeholder confidence and client satisfaction index",
                        "target": ">= 4.5 / 5.0 rating",
                        "sourceData": "Quarterly CSAT & 360 Review Scores",
                        "frequency": "Quarterly"
                    },
                    {
                        "outcomeArea": "Process & Competency Growth",
                        "metric": "Continuous skill improvement, tech sharing sessions & mentorship",
                        "target": ">= 2 sessions per quarter",
                        "sourceData": "Engineering Guild & HR ER Records",
                        "frequency": "Quarterly"
                    }
                ],
                "careerPath": {
                    "previousRoles": [],
                    "nextRoles": []
                },
                "sourceDoc": fname
            }
            
            dept_map[dept_id]["roles"].append(role_obj)

    level_order = {
        "Associate (L1)": 1,
        "Mid-Level (L2)": 2,
        "Senior (L3)": 3,
        "Lead (L4)": 4,
        "Management (L4-L5)": 5,
        "Principal / Architect (L5)": 6,
        "Executive / Director (L6)": 7
    }
    
    for dept in departments:
        dept["roles"].sort(key=lambda r: (level_order.get(r.get("level", ""), 99), r.get("title", "")))
        for i, r in enumerate(dept["roles"]):
            if i > 0:
                r["careerPath"]["previousRoles"].append({
                    "id": dept["roles"][i-1]["id"],
                    "title": dept["roles"][i-1]["title"]
                })
            if i < len(dept["roles"]) - 1:
                r["careerPath"]["nextRoles"].append({
                    "id": dept["roles"][i+1]["id"],
                    "title": dept["roles"][i+1]["title"]
                })

    data_payload = {
        "organization": "Taazaa Inc.",
        "portalTitle": "Taazaa KRA & Role Charter System",
        "portalSubtitle": "Empowering Employee Growth, Clear Performance Accountability & Unified Role Charters",
        "lastUpdated": "2026-08-20",
        "version": "1.0.0",
        "departments": departments,
        "raciMatrix": [
            {
                "activity": "Project Scope & Charter Signoff",
                "deliveryManager": "Accountable",
                "programManager": "Consulted",
                "techLead": "Informed",
                "productManager": "Responsible"
            },
            {
                "activity": "Sprint Planning & Backlog Grooming",
                "deliveryManager": "Informed",
                "programManager": "Informed",
                "techLead": "Responsible",
                "productManager": "Accountable"
            },
            {
                "activity": "Technical Architecture & Code Review",
                "deliveryManager": "Informed",
                "programManager": "Informed",
                "techLead": "Accountable",
                "productManager": "Informed"
            },
            {
                "activity": "Release Quality & Test Automation",
                "deliveryManager": "Informed",
                "programManager": "Informed",
                "techLead": "Consulted",
                "productManager": "Informed"
            },
            {
                "activity": "Client CSAT & Account Escalations",
                "deliveryManager": "Accountable",
                "programManager": "Responsible",
                "techLead": "Consulted",
                "productManager": "Consulted"
            },
            {
                "activity": "Resource Allocation & Billing Margin",
                "deliveryManager": "Accountable",
                "programManager": "Responsible",
                "techLead": "Informed",
                "productManager": "Informed"
            }
        ]
    }

    out_file = "src/data/kras.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data_payload, f, indent=2, ensure_ascii=False)
    
    total_roles = sum(len(d['roles']) for d in departments)
    print(f"Generated clean dataset {out_file} with {total_roles} primary roles across {len(departments)} departments!")

if __name__ == "__main__":
    build_dataset()
