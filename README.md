# Priyanka Saini — Economics, Finance & Risk Analytics Portfolio

[![Live Site](https://img.shields.io/badge/Status-Live%20on%20GitHub%20Pages-10b981?style=flat-square&logo=github)](https://priyankasaini0202.github.io)
[![Education](https://img.shields.io/badge/BITS%20Pilani-M.Sc.%20(Hons.)%20Economics-38bdf8?style=flat-square)](https://in.linkedin.com/in/priyanka-saini-2b8219195)
[![Current Role](https://img.shields.io/badge/National%20Australia%20Bank-Advisor-2563eb?style=flat-square)](https://in.linkedin.com/in/priyanka-saini-2b8219195)

Welcome to the official repository for my professional portfolio and interactive analytics workspace. Designed with a decoupled architecture, this site showcases my academic background in Economics and Management from **BITS Pilani**, professional experience at **National Australia Bank** and **Deutsche Bank**, and empirical research projects.

🔗 **Live Website:** [https://priyankasaini0202.github.io](https://priyankasaini0202.github.io)

---

## 🌟 Key Features & Architecture

* **📈 Interactive Finance & Econometrics Labs (`labs.html`):**
  * **Corporate Credit Risk Evaluator:** Dynamic scoring based on Debt-to-Equity, Current Ratio, and Interest Coverage.
  * **Energy Policy Levy Simulator:** Visualizes supply-demand shifts, market price impact, and deadweight loss.
  * **Derivatives Payoff Visualizer:** Interactive long call option payoff and breakeven calculator.
  * **Econometric Diagnostic Challenges:** Test specifications for panel data models and stationarity checks.
* **🎓 Academic Mentoring Hub (`tutoring.html`):**
  * Built on my experience as a **WILP Learning Facilitator at BITS Pilani** and mentor to over 150+ students.
  * Features an interactive fee calculator supporting INR (₹) and USD ($) for 1-on-1 tutoring sessions in Economics, Managerial Accounting, and data tools (Excel, SQL, R, Stata).
* **📖 Dynamic Blog & Automated Workflow (`blog.html`):**
  * Articles and research briefs on credit risk, banking operations, panel econometrics, and corporate finance.
  * Automated daily blog publishing pipeline powered by **GitHub Actions** and the Gemini API (`scripts/generate_daily_blog.py`).
  * Instant **BibTeX citation generator** and one-click **LinkedIn sharing tools** for every article.
* **📋 Printable Executive Capabilities Deck (`capabilities.html`):**
  * A clean, 1-page executive summary formatted for print and PDF export.
* **⌨️ Quick Command Palette (`Ctrl+K`):**
  * Instant keyboard navigation to jump across labs, download resume PDFs, copy direct contact details, or toggle themes.
* **🌓 Dark/Light Mathematical Blueprint Theme:**
  * Custom CSS variables supporting seamless dark and light modes with floating economic symbols ($\Sigma$, $\beta$, $\alpha$, $\pi$).

---

## 🛠️ Technical Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+), Chart.js
* **Styling:** Custom responsive CSS grid with CSS custom properties (Design tokens)
* **Automation:** Python 3.11, GitHub Actions (Cron workflows)
* **Hosting:** GitHub Pages

---

## 🗂️ Project File Structure

```text
portfolio/
├── .github/
│   └── workflows/
│       └── daily-blog.yml      # Automated daily blog sync action
├── assets/
│   ├── css/
│   │   └── style.css           # Global design system & theme variables
│   ├── js/
│   │   └── app.js              # Interactive labs, command palette & dynamic loaders
│   └── img/
│       └── logo.svg            # Portfolio vector emblem
├── data/
│   ├── posts.json              # Decoupled blog articles dataset
│   ├── projects.json           # Research projects & methodologies
│   └── testimonials.json       # Endorsements & feedback
├── scripts/
│   └── generate_daily_blog.py  # Python script for AI blog generation
├── index.html                  # Landing page & core profile
├── tutoring.html               # 1-on-1 mentoring & session planner
├── labs.html                   # Interactive finance & econometrics sandboxes
├── blog.html                   # Article archive & BibTeX generator
├── capabilities.html           # 1-page printable executive deck
├── 404.html                    # Custom out-of-sample error page
├── robots.txt                  # Search engine crawler directives
├── sitemap.xml                 # XML sitemap for SEO
├── rss.xml                     # RSS feed for blog syndication
├── manifest.json               # Web app manifest
├── resume_Priyanka.pdf         # Downloadable resume PDF
└── IMG_Priyanka_Saini.jpg      # Profile photograph
