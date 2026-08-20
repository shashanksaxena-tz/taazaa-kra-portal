# Taazaa KRA & Role Charter Portal

> **A modern, interactive, high-performance portal for Taazaa Employee Relations (ER), Human Resources (HR), and all employees to explore, compare, and manage Key Result Areas (KRAs), Role Charters, and Competencies.**

Hosted natively on **GitHub Pages** with zero backend infrastructure costs, client-side data persistence, and an interactive Admin Management panel with direct GitHub API commit capabilities.

---

## 🌟 Key Features

### 1. 🏢 All 5 Core Departments & 29+ Role Charters
- **Engineering**: Software Engineer, Senior Software Engineer, Lead Software Engineer, Module Lead, Technical Lead, Technical Architect, Principal Architect, Principal Engineer.
- **Quality Assurance & SDET**: Associate SDET, SDET I, SDET II / Automation Engineer, Senior SDET, Principal SDET, Quality Assurance Engineer, QA Lead.
- **UI/UX & Product Design**: Associate UX/UI Designer, UX/UI Designer, Senior UX/UI Designer, Lead UX/UI Designer.
- **Product Management**: Business Analyst, Senior Business Analyst, Product Manager, Senior Product Manager.
- **Program & Delivery Management**: Project Manager, Senior Technical Project Manager, Technical Project Manager, Program Manager, Delivery Manager, Director of Delivery.

### 2. 🎯 Deep-Dive Role Details & Appraisal Ready Export
- **Core Mission**: Clear, inspirational mission statements.
- **Primary Accountabilities**: Bulleted outcome responsibilities.
- **Competency Matrix**:
  - Behavioral Competencies (Taazaa Owner Level)
  - Technical & Functional Competencies
  - Domain & Delivery Standards
- **Quarterly OKRs & Metrics Table**: Outcome areas, metric benchmarks, sources of measurement, and review frequencies.
- **Career Ladder**: Visual previous/next role progression pathways.
- **Appraisal Print View**: Instant one-click Print / Save as PDF formatted cleanly for 1-on-1 performance reviews.

### 3. ⚖️ Interactive Role Comparator
- Compare any two roles side-by-side (e.g. *Technical Lead* vs *Lead Software Engineer*, or *Delivery Manager* vs *Program Manager*).
- Highlight differences in accountabilities, competencies, and OKRs.

### 4. 📊 Cross-Functional RACI Governance Matrix
- Interactive RACI Matrix for Delivery Managers, Program Managers, Technical Leads, and Product Managers across 15 operational touchpoints.

### 5. 🛡️ ER & HR Admin Workspace (No-Code Content Management)
- **Role Manager**: Add, edit, or delete any role charter with real-time form validation.
- **Direct GitHub Sync**: Commit edits directly to `src/data/kras.json` via GitHub REST API without touching terminal commands. Triggers automatic GitHub Pages deployment within 1 minute.
- **Backup & Restore**: Download instant JSON backups or upload JSON files to restore state.
- **Default Admin Passcode**: `taazaa2026`

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Local Run
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the portal.

---

## 🌐 Deploying to GitHub Pages

1. Initialize Git and create a repository:
```bash
git init
git add .
git commit -m "feat: initial commit of Taazaa KRA portal"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

2. Enable GitHub Pages:
   - Go to your repository settings on GitHub: **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.
   - The included `.github/workflows/deploy.yml` workflow will automatically build and publish the portal.

---

## 🛠️ Data Ingestion Script

If you update the original Word documents (`.docx`), re-run the Python parser to update `src/data/kras.json`:
```bash
python3 scripts/build_kras_dataset.py
```

---

## 🎨 Technology Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Taazaa Brand Palettes
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Hosting**: GitHub Pages (Zero ongoing cost)
