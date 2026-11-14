function setActive(btn) {
  if (!btn || !btn.parentElement) return;
  btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleMobileNav() {
  const nav = document.querySelector('.nav-links');
  if (nav) nav.classList.toggle('mobile-open');
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '☀️ Light' : '🌙 Dark';
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
}
initTheme();

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

function copyEmail() {
  navigator.clipboard.writeText('priyasaini202004@gmail.com');
  showToast('✓ Copied priyasaini202004@gmail.com to clipboard!');
}

function copyPhone() {
  navigator.clipboard.writeText('+91 9602591005');
  showToast('✓ Copied +91 9602591005 to clipboard!');
}

let ALL_POSTS = [];
async function loadPosts() {
  const homeContainer = document.getElementById('featured-blogs-grid');
  const fullContainer = document.getElementById('all-blogs-list');
  if (!homeContainer && !fullContainer) return;

  try {
    const todayKey = new Date().toISOString().slice(0, 10);
    const res = await fetch('data/posts.json?v=' + todayKey);
    ALL_POSTS = await res.json();

    if (homeContainer) {
      const top3 = ALL_POSTS.slice(0, 3);
      homeContainer.innerHTML = top3.map(p => `
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="item-header">
              <span class="section-tag" style="margin:0;">${p.topic_label}</span>
              <span class="item-date">${p.date} • ${p.read_time}</span>
            </div>
            <h3 style="font-size:1.12rem; margin:0.55rem 0;">${p.title}</h3>
            <p style="color:var(--muted); font-size:0.91rem; margin-bottom:1rem;">${p.summary}</p>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="openPostModal('${p.id}')">Read Article →</button>
            <button class="btn btn-glass btn-sm" onclick="copyBibtex('${p.id}')">Cite (BibTeX)</button>
          </div>
        </div>
      `).join('');
    }

    if (fullContainer) {
      renderBlogArchive('all', '');
    }
  } catch (e) {
    console.error('Failed to load posts.json', e);
  }
}

function copyBibtex(id) {
  const p = ALL_POSTS.find(x => x.id === id);
  if (!p) return;
  const year = (p.date || '2026').slice(0, 4);
  const bib = `@article{saini${year}_${p.id.replace('-','')},
  author = {Saini, Priyanka},
  title = {${p.title}},
  journal = {Priyanka Saini Economics & Finance Notes},
  year = {${year}},
  url = {https://priyankasaini.github.io/blog.html#${p.id}}
}`;
  navigator.clipboard.writeText(bib);
  showToast('✓ Copied BibTeX citation to clipboard!');
}

function sharePostLinkedIn(id) {
  const url = encodeURIComponent(`https://priyankasaini.github.io/blog.html#${id}`);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function copyLinkedInPost(id) {
  const p = ALL_POSTS.find(x => x.id === id);
  if (!p) return;
  const postText = `${p.title}

${p.summary}

Framework:
${p.architecture_flow}

Key Takeaway: ${p.takeaway}

#Economics #Finance #CreditRisk #Econometrics #Banking #BITSPilani`;
  navigator.clipboard.writeText(postText);
  showToast('✓ Ready-to-post LinkedIn draft copied to clipboard!');
}

function renderBlogArchive(topic, query) {
  const fullContainer = document.getElementById('all-blogs-list');
  const tocContainer = document.getElementById('blog-toc');
  if (!fullContainer) return;
  const q = (query || '').toLowerCase();
  const filtered = ALL_POSTS.filter(p => {
    const matchTopic = topic === 'all' || p.topic === topic;
    const matchQuery = !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
    return matchTopic && matchQuery;
  });

  if (tocContainer) {
    tocContainer.innerHTML = filtered.map(p => `<a href="#${p.id}" style="color:var(--accent); text-decoration:none; font-size:0.82rem; display:block; margin-bottom:0.35rem;">→ ${p.title}</a>`).join('');
  }

  fullContainer.innerHTML = filtered.map(p => `
    <article id="${p.id}" class="card" style="margin-bottom:1.75rem;">
      <div class="item-header">
        <span class="section-tag" style="margin:0;">${p.topic_label} • ${p.date}</span>
        <span class="item-date">${p.read_time}</span>
      </div>
      <h2 style="font-size:1.45rem; margin:0.45rem 0 0.75rem;">${p.title}</h2>
      <p style="color:var(--muted); margin-bottom:0.9rem;">${p.summary}</p>
      <div class="trace-box" style="color:var(--accent);">${p.architecture_flow}</div>
      ${(p.sections || []).map(s => `
        <h3 style="font-size:1.02rem; margin:1rem 0 0.35rem; font-family:'Fira Code', monospace;">${s.heading}</h3>
        <p style="color:var(--muted); font-size:0.94rem;">${s.body}</p>
      `).join('')}
      <div class="verdict-box show" style="margin-top:1rem;"><strong>Key Takeaway:</strong> ${p.takeaway}</div>
      <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-top:1.1rem; padding-top:0.9rem; border-top:1px solid var(--border);">
        <button class="btn btn-glass btn-sm" onclick="copyBibtex('${p.id}')">📋 Copy BibTeX Citation</button>
        <button class="btn btn-primary btn-sm" onclick="sharePostLinkedIn('${p.id}')">Share on LinkedIn ↗</button>
        <button class="btn btn-glass btn-sm" onclick="copyLinkedInPost('${p.id}')">✍️ Copy LinkedIn Post</button>
      </div>
    </article>
  `).join('') || '<p style="color:var(--muted);">No articles match that filter.</p>';
}

function openPostModal(id) {
  const p = ALL_POSTS.find(item => item.id === id);
  if (!p) return;
  document.getElementById('modalTag').textContent = `${p.topic_label} • ${p.date}`;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalArch').textContent = p.architecture_flow;
  document.getElementById('modalDesc').innerHTML =
    (p.sections || []).map(s => `<p style="margin-bottom:0.8rem;"><strong>${s.heading}:</strong> ${s.body}</p>`).join('') +
    `<p style="color:var(--accent-green); margin-bottom:1rem;"><strong>Takeaway:</strong> ${p.takeaway}</p>` +
    `<div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button class="btn btn-glass btn-sm" onclick="copyBibtex('${p.id}')">📋 Copy BibTeX</button>
      <button class="btn btn-glass btn-sm" onclick="sharePostLinkedIn('${p.id}')">Share on LinkedIn ↗</button>
    </div>`;
  const link = document.getElementById('modalRepoLink');
  link.textContent = 'Open Full Blog Archive →';
  link.href = 'blog.html';
  document.getElementById('projectModal').classList.add('open');
}

let ALL_PROJECTS = [];
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  try {
    const res = await fetch('data/projects.json');
    ALL_PROJECTS = await res.json();
    grid.innerHTML = ALL_PROJECTS.map(pr => `
      <div class="card project-card" data-cat="${pr.cat}" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div class="item-header">
            <span class="item-title">${pr.title}</span>
            <span class="item-date">${pr.badge}</span>
          </div>
          <p style="color:var(--muted); font-size:0.93rem; margin:0.75rem 0 1rem;">${pr.summary}</p>
          <div class="tags">${pr.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
        <div style="display:flex; gap:0.6rem; margin-top:1.2rem; padding-top:0.9rem; border-top:1px solid var(--border);">
          <button class="btn btn-primary btn-sm" onclick="openProjectModal('${pr.id}')">Methodology & Framework →</button>
          <a href="${pr.repo}" target="_blank" rel="noopener" class="btn btn-glass btn-sm">LinkedIn ↗</a>
        </div>
      </div>
    `).join('');
  } catch (e) { console.error(e); }
}

function openProjectModal(id) {
  const pr = ALL_PROJECTS.find(p => p.id === id);
  if (!pr) return;
  document.getElementById('modalTag').textContent = pr.badge;
  document.getElementById('modalTitle').textContent = pr.title;
  document.getElementById('modalArch').textContent = pr.arch;
  document.getElementById('modalDesc').textContent = pr.details;
  const link = document.getElementById('modalRepoLink');
  link.textContent = 'Connect on LinkedIn ↗';
  link.href = pr.repo;
  document.getElementById('projectModal').classList.add('open');
}

function closeModalBtn() { document.getElementById('projectModal').classList.remove('open'); }
function closeModal(e) { if (e.target.id === 'projectModal') closeModalBtn(); }

async function loadTestimonials() {
  const wrap = document.getElementById('testimonials-grid');
  if (!wrap) return;
  try {
    const res = await fetch('data/testimonials.json');
    const items = await res.json();
    wrap.innerHTML = items.map(t => `
      <div class="card">
        <p style="font-style:italic; color:var(--text); font-size:0.94rem; margin-bottom:0.9rem;">"${t.quote}"</p>
        <div style="font-weight:700; font-size:0.88rem; color:var(--accent);">${t.author}</div>
        <div style="font-size:0.78rem; color:var(--muted); font-family:'Fira Code', monospace;">${t.role}</div>
      </div>
    `).join('');
  } catch (e) { console.error(e); }
}

function runCreditRiskDemo() {
  const dte = parseFloat(document.getElementById('crDte')?.value || '1.2');
  const cr = parseFloat(document.getElementById('crCurrent')?.value || '1.8');
  const icr = parseFloat(document.getElementById('crIcr')?.value || '4.5');
  const out = document.getElementById('creditRiskOutput');
  if (!out) return;

  const levScore = Math.max(0, Math.min(35, 35 - (dte - 0.5) * 12));
  const liqScore = Math.max(0, Math.min(35, (cr / 2.5) * 35));
  const covScore = Math.max(0, Math.min(30, (icr / 6.0) * 30));
  const total = Math.round(levScore + liqScore + covScore);

  let rating = 'BBB / Moderate Risk';
  let color = '#f59e0b';
  if (total >= 78) { rating = 'AA / Strong Investment Grade'; color = '#10b981'; }
  else if (total < 50) { rating = 'B / Elevated Covenant Risk'; color = '#ef4444'; }

  out.innerHTML = `
    <div style="color:${color}; font-weight:700;">
      [CREDIT SCORE: ${total}/100] • Internal Risk Tier: ${rating}
    </div>
    <div style="margin-top:0.4rem; color:var(--muted);">
      Debt-to-Equity: ${dte.toFixed(2)}x | Current Ratio: ${cr.toFixed(2)}x | Interest Coverage: ${icr.toFixed(2)}x
    </div>
  `;
}

function updateEconPolicyViz() {
  const canvas = document.getElementById('econPolicyCanvas');
  const taxSlider = document.getElementById('policyTaxSlider');
  const label = document.getElementById('econPolicyReadout');
  if (!canvas || !taxSlider) return;

  const tax = +taxSlider.value;
  const eqQ = (80 - tax) / 2;
  const eqP = 100 - eqQ;
  const dwl = 0.5 * tax * (40 - eqQ);

  label.innerHTML = `Carbon / Policy Levy = <strong>$${tax}/unit</strong> | Equilibrium Qty Q* = <strong>${eqQ.toFixed(1)}</strong> | Market Price P* = <strong>$${eqP.toFixed(1)}</strong> | Deadweight Loss = <span style="color:#f59e0b;">$${dwl.toFixed(1)}</span>`;

  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = 200;
  ctx.clearRect(0, 0, w, h);

  const ox = 45, oy = h - 28, gw = w - 70, gh = h - 48;
  const toX = q => ox + (q / 80) * gw;
  const toY = p => oy - (p / 110) * gh;

  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.beginPath(); ctx.moveTo(ox, 12); ctx.lineTo(ox, oy); ctx.lineTo(w - 15, oy); ctx.stroke();

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(toX(0), toY(100)); ctx.lineTo(toX(80), toY(20)); ctx.stroke();

  ctx.strokeStyle = '#64748b'; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(toX(0), toY(20)); ctx.lineTo(toX(80), toY(100)); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(toX(0), toY(20 + tax)); ctx.lineTo(toX(80 - tax), toY(100)); ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(toX(eqQ), toY(eqP), 6, 0, Math.PI * 2); ctx.fill();
  ctx.font = '11px Fira Code, monospace';
  ctx.fillText(`E*(Q=${eqQ.toFixed(0)}, P=${eqP.toFixed(0)})`, toX(eqQ) + 8, toY(eqP) - 4);
}

function updateOptionViz() {
  const canvas = document.getElementById('optionCanvas');
  const strikeSlider = document.getElementById('strikeSlider');
  const premSlider = document.getElementById('premSlider');
  const readout = document.getElementById('optionReadout');
  if (!canvas || !strikeSlider || !premSlider) return;

  const K = +strikeSlider.value;
  const prem = +premSlider.value;
  const breakeven = K + prem;
  readout.innerHTML = `Strike Price K = <strong>$${K}</strong> | Option Premium = <strong>$${prem}</strong> | Breakeven Spot S_T = <span style="color:#10b981;">$${breakeven}</span>`;

  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = 195;
  ctx.clearRect(0, 0, w, h);

  const ox = 40, midY = h / 2 + 10, gw = w - 60;
  const toX = s => ox + ((s - 50) / 100) * gw;
  const toY = pnl => midY - pnl * 1.4;

  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.beginPath(); ctx.moveTo(ox, midY); ctx.lineTo(w - 15, midY); ctx.stroke();

  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let s = 50; s <= 150; s += 2) {
    const pnl = Math.max(0, s - K) - prem;
    if (s === 50) ctx.moveTo(toX(s), toY(pnl)); else ctx.lineTo(toX(s), toY(pnl));
  }
  ctx.stroke();

  if (breakeven >= 50 && breakeven <= 150) {
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(toX(breakeven), midY, 5, 0, Math.PI * 2); ctx.fill();
  }
}

function evaluateTrace(choice) {
  const box = document.getElementById('reasoningVerdict');
  if (!box) return;
  box.classList.add('show');
  if (choice === 'A') {
    box.style.borderLeftColor = 'var(--accent-green)';
    box.innerHTML = '<strong>✓ Spot On! Memo A commits Omitted Variable & Non-Stationarity Bias.</strong> Running pooled OLS on non-stationary energy price series without country/year fixed effects conflates global inflation shocks with policy impact. Memo B properly applies unit-root testing and fixed-effects panel controls.';
  } else {
    box.style.borderLeftColor = 'var(--accent-red)';
    box.innerHTML = '<strong>✕ Look closer at Memo A!</strong> Memo B correctly includes entity/time fixed effects and stationarity checks before estimating policy elasticity. Memo A ignores macro time trends.';
  }
}

function filterItems(cardClass, category, btn) {
  btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.' + cardClass).forEach(card => {
    const cat = card.getAttribute('data-cat');
    card.style.display = (category === 'all' || cat === category) ? '' : 'none';
  });
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('senderName').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const message = document.getElementById('senderMsg').value.trim();
  window.location.href = `mailto:priyasaini202004@gmail.com?subject=${encodeURIComponent('Portfolio / Consulting Inquiry from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')

' + message)}`;
  showToast('✓ Opening your email client addressed to Priyanka Saini!');
}

document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  loadProjects();
  loadTestimonials();
  runCreditRiskDemo();
  updateEconPolicyViz();
  updateOptionViz();

  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const roles = [
      "Advisor • National Australia Bank (Business & Private Banking)",
      "Learning Facilitator • WILP, BITS Pilani (Managerial Accounting)",
      "M.Sc. (Hons.) Economics & Minor in Management • BITS Pilani",
      "Credit Risk, Financial Analytics & Econometrics Specialist"
    ];
    let r = 0, c = 0, del = false;
    (function loop() {
      const cur = roles[r];
      typedEl.textContent = del ? cur.substring(0, c--) : cur.substring(0, c++);
      let spd = del ? 38 : 75;
      if (!del && c === cur.length + 1) { spd = 1900; del = true; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; spd = 380; }
      setTimeout(loop, spd);
    })();
  }

  const tsCtx = document.getElementById('tsChart');
  const nlpCtx = document.getElementById('nlpChart');
  if (tsCtx && nlpCtx && typeof Chart !== 'undefined') {
    new Chart(tsCtx, {
      type: 'bar',
      data: {
        labels: ['Pooled OLS', 'Random Effects', 'Fixed Effects', 'Panel + Time Controls'],
        datasets: [{ label: 'Adjusted R² (%)', data: [61.2, 74.8, 86.5, 92.4], backgroundColor: ['#64748b', '#4facfe', '#f59e0b', '#10b981'], borderRadius: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 50, max: 100 } } }
    });
    new Chart(nlpCtx, {
      type: 'bar',
      data: {
        labels: ['Leverage Check', 'Liquidity Audit', 'Macro Overlay', 'Full QC Governance'],
        datasets: [{ label: 'Compliance & Accuracy (%)', data: [84.0, 89.5, 94.0, 99.4], backgroundColor: ['#a855f7', '#4facfe', '#f59e0b', '#00f2fe'], borderRadius: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 75, max: 100 } } }
    });
  }
});

function runCmd(key) {
  const body = document.getElementById('terminal-body');
  const map = {
    stack: { c: "./analytics_stack.sh", o: `"econometrics": ["R Programming", "Stata", "Python", "Panel & Time-Series"],<br>"finance_bi": ["Advanced Excel", "SQL", "Webobs Settlement", "Financial Modeling"]` },
    risk: { c: "./risk_audit.sh", o: `[PASS] Corporate Credit Risk: Leverage, Liquidity & Counterparty Stress<br>[PASS] Trade Lifecycle QC & Regulatory Compliance Governance` },
    impact: { c: "./credentials.sh", o: `• BITS Pilani: M.Sc. (Hons.) Economics + Minor in Management<br>• Experience: National Australia Bank • Deutsche Bank • Grasim • WILP` },
    contact: { c: "./connect.sh", o: `Email: priyasaini202004@gmail.com | Phone: +91 9602591005<br>LinkedIn: linkedin.com/in/priyanka-saini-2b8219195` }
  };
  const item = map[key];
  body.innerHTML = `<div><span style="color:#10b981;">➜</span> ${item.c}</div><div class="cmd-output">${item.o}</div>`;
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (typeof updateEconPolicyViz === 'function') updateEconPolicyViz();
    if (typeof updateOptionViz === 'function') updateOptionViz();
  }, 150);
});

let EST_CURRENCY = 'INR';
const SPRINT_CATALOG = {
  credit:   { name: 'Sprint 01: Corporate Credit Risk & Financial Statement Audit', usd: [900, 1500], inr: [40000, 75000], days: [5, 8] },
  econ:     { name: 'Sprint 02: Econometric Policy & Panel Data Modeling (R/Stata)', usd: [1100, 1800], inr: [50000, 90000], days: [7, 10] },
  finmodel: { name: 'Sprint 03: Financial Forecasting & SQL/Excel Variance Dashboard', usd: [850, 1400], inr: [38000, 70000], days: [5, 7] },
  retainer: { name: 'Monthly Economic & Financial Analytics Advisory', usd: [1200, 2000], inr: [55000, 95000], days: [30, 30] }
};

function setEstimatorCurrency(curr) {
  EST_CURRENCY = curr;
  document.getElementById('currUsdBtn')?.classList.toggle('active', curr === 'USD');
  document.getElementById('currInrBtn')?.classList.toggle('active', curr === 'INR');
  updateSprintEstimate();
}

function updateSprintEstimate() {
  const trackEl = document.getElementById('estTrack');
  if (!trackEl) return;
  const base = SPRINT_CATALOG[trackEl.value] || SPRINT_CATALOG.credit;
  const addEval = document.getElementById('addonEval')?.checked;
  const addDocker = document.getElementById('addonDocker')?.checked;
  const addUi = document.getElementById('addonUi')?.checked;
  const addonCount = (addEval ? 1 : 0) + (addDocker ? 1 : 0) + (addUi ? 1 : 0);

  const minDays = base.days[0] + addonCount * 2;
  const maxDays = base.days[1] + addonCount * 2;

  let priceStr = '';
  if (EST_CURRENCY === 'USD') {
    const low = base.usd[0] + addonCount * 250;
    const high = base.usd[1] + addonCount * 350;
    priceStr = `$${low.toLocaleString()} – $${high.toLocaleString()}`;
  } else {
    const low = base.inr[0] + addonCount * 12000;
    const high = base.inr[1] + addonCount * 18000;
    priceStr = `₹${low.toLocaleString('en-IN')} – ₹${high.toLocaleString('en-IN')}`;
  }

  const priceEl = document.getElementById('estPriceDisplay');
  const timeEl = document.getElementById('estTimeDisplay');
  if (priceEl) priceEl.textContent = priceStr + (trackEl.value === 'retainer' ? ' / mo' : '');
  if (timeEl) timeEl.textContent = trackEl.value === 'retainer'
    ? 'Ongoing Monthly Advisory • Weekly Executive Reviews'
    : `Estimated Timeline: ${minDays}–${maxDays} Business Days`;
}

function applyEstimateToContact() {
  const trackEl = document.getElementById('estTrack');
  const msgBox = document.getElementById('senderMsg');
  const contactSec = document.getElementById('contact');
  if (!trackEl || !msgBox) return;

  const base = SPRINT_CATALOG[trackEl.value];
  const addons = [];
  if (document.getElementById('addonEval')?.checked) addons.push('Macro Sensitivity & Stress-Test Annex');
  if (document.getElementById('addonDocker')?.checked) addons.push('Automated SQL + Excel Reporting Template');
  if (document.getElementById('addonUi')?.checked) addons.push('Board-Ready Executive Presentation Deck');

  const priceText = document.getElementById('estPriceDisplay')?.textContent || '';
  const timeText = document.getElementById('estTimeDisplay')?.textContent || '';

  msgBox.value = `Hi Priyanka,

I'd like to discuss an advisory engagement:
• Track: ${base.name}
• Add-ons: ${addons.length ? addons.join(', ') : 'Core Deliverable Only'}
• Estimator Range: ${priceText} (${timeText})

Project context & objectives:
`;
  if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
  msgBox.focus();
  showToast('✓ Engagement brief pre-filled below!');
}

let TUT_CURRENCY = 'INR';
const TUTOR_RATES = {
  school: { label: 'Senior Secondary Economics & Commerce (Classes 11–12)', usd: [18, 25], inr: [800, 1200] },
  ug:     { label: 'Undergraduate Economics, Finance & Statistics', usd: [22, 30], inr: [1000, 1500] },
  wilp:   { label: 'Managerial Accounting, Corporate Finance & Econometrics', usd: [25, 35], inr: [1200, 1800] },
  tools:  { label: 'Applied Excel, SQL, R Programming & Stata Workshop', usd: [25, 35], inr: [1200, 1800] }
};

function setTutorCurrency(curr) {
  TUT_CURRENCY = curr;
  document.getElementById('tutUsdBtn')?.classList.toggle('active', curr === 'USD');
  document.getElementById('tutInrBtn')?.classList.toggle('active', curr === 'INR');
  updateTutorEstimate();
}

function updateTutorEstimate() {
  const gradeEl = document.getElementById('tutGrade');
  if (!gradeEl) return;
  const info = TUTOR_RATES[gradeEl.value] || TUTOR_RATES.ug;
  const rateEl = document.getElementById('tutRateDisplay');
  const packEl = document.getElementById('tutPackDisplay');

  if (TUT_CURRENCY === 'USD') {
    rateEl.textContent = `$${info.usd[0]} – $${info.usd[1]} / hour`;
    packEl.textContent = `Monthly 8-Session Pack: $${Math.round(info.usd[0] * 7.2)} – $${Math.round(info.usd[1] * 7.2)} (Save 10%)`;
  } else {
    rateEl.textContent = `₹${info.inr[0].toLocaleString('en-IN')} – ₹${info.inr[1].toLocaleString('en-IN')} / hour`;
    packEl.textContent = `Monthly 8-Session Pack: ₹${Math.round(info.inr[0] * 7.2).toLocaleString('en-IN')} – ₹${Math.round(info.inr[1] * 7.2).toLocaleString('en-IN')} (Save 10%)`;
  }
}

function applyTutorToContact() {
  const gradeEl = document.getElementById('tutGrade');
  const msgBox = document.getElementById('senderMsg');
  const contactSec = document.getElementById('contact');
  if (!gradeEl || !msgBox) return;

  const info = TUTOR_RATES[gradeEl.value];
  const subs = [];
  if (document.getElementById('subMath')?.checked) subs.push('Micro/Macro Economics & Econometrics');
  if (document.getElementById('subSci')?.checked) subs.push('Managerial Accounting & Corporate Finance');
  if (document.getElementById('subEng')?.checked) subs.push('Excel, SQL, R & Stata');

  const rateText = document.getElementById('tutRateDisplay')?.textContent || '';
  msgBox.value = `Hi Priyanka,

I would like to book a Free 20-Min Trial Session for 1-on-1 Mentoring:
• Track: ${info.label}
• Focus Areas: ${subs.length ? subs.join(', ') : 'Economics & Finance'}
• Estimated Rate: ${rateText}
• Preferred Days & Syllabus Details:
`;
  if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
  msgBox.focus();
  showToast('✓ Trial session details pre-filled below!');
}

function showTutorTimezone(region, btn) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const box = document.getElementById('tzDisplay');
  if (!box) return;
  const slots = {
    in: '<strong>🇮🇳 India Slots (IST):</strong><br/>• Weekdays (Mon–Fri): <strong>6:30 PM – 9:30 PM IST</strong><br/>• Weekends (Sat–Sun): <strong>10:00 AM – 6:00 PM IST</strong>',
    apac: '<strong>🇦🇺 Australia & Singapore Slots (AEST / SGT):</strong><br/>• Weekdays: <strong>4:00 PM – 8:00 PM SGT</strong> (6:00 PM – 10:00 PM AEST)<br/>• Weekends: <strong>11:00 AM – 6:00 PM SGT</strong>',
    uk: '<strong>🇬🇧 UK & Europe Slots (GMT / CET):</strong><br/>• Weekdays: <strong>2:00 PM – 5:00 PM GMT</strong><br/>• Weekends: <strong>9:00 AM – 2:00 PM GMT</strong>',
    us: '<strong>🇺🇸 US & Canada Morning Slots (EST / PST):</strong><br/>• Weekends (Sat–Sun): <strong>8:00 AM – 11:30 AM EST</strong>'
  };
  box.innerHTML = slots[region] || slots.in;
}

const PORTFOLIO_KB = [
  {
    keys: ['experience', 'nab', 'national australia bank', 'deutsche', 'grasim', 'wilp', 'work', 'role', 'job'],
    ans: 'Priyanka currently works as an Advisor at National Australia Bank (Apr 2026–Present) managing Business & Private Banking trade lifecycles and Webobs settlements, and serves as a Learning Facilitator at WILP, BITS Pilani (May 2026–Present) for Managerial Accounting. Previously, she interned as a Risk Analyst at Deutsche Bank India (Jan–Jun 2025) and Financial Analytics Intern at Grasim Industries (2023).'
  },
  {
    keys: ['education', 'bits', 'pilani', 'economics', 'management', 'degree', 'cgpa', 'school', 'birla'],
    ans: 'Priyanka holds an M.Sc. (Hons.) in Economics (2025) and a Minor Degree in Management from BITS Pilani (Pilani Campus), after scoring 96% in Class XII and 95% in Class X at Birla Balika Vidyapeeth, Pilani.'
  },
  {
    keys: ['skills', 'tools', 'excel', 'sql', 'python', 'r', 'stata', 'powerpoint', 'technical'],
    ans: 'Her core technical stack includes Excel, SQL, Python, R Programming, Stata, and PowerPoint, paired with deep coursework in Econometric Methods, Derivatives & Risk Management, Security Analysis & Portfolio Management, and Business Valuation.'
  },
  {
    keys: ['project', 'research', 'energy', 'sustainability', 'governance', 'skill', 'employment'],
    ans: 'Key research projects include: (1) Analyzing Impact of Energy Policies in the Market (time-series & panel data in R/Excel), (2) Sustainability in Global Value Chains, (3) Perceived Effectiveness of E-Governance, and (4) Role of Skill-Based Education and Employment.'
  },
  {
    keys: ['contact', 'email', 'phone', 'linkedin', 'hire', 'call', 'number'],
    ans: 'You can reach Priyanka directly at priyasaini202004@gmail.com, call/WhatsApp +91 9602591005, or connect on LinkedIn at linkedin.com/in/priyanka-saini-2b8219195.'
  }
];

function togglePortfolioChat() {
  const box = document.getElementById('aiChatBox');
  if (!box) return;
  box.style.display = box.style.display === 'none' || !box.style.display ? 'block' : 'none';
}

function askPortfolioBot(question) {
  const log = document.getElementById('aiChatLog');
  if (!log) return;
  const qWords = question.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  let best = PORTFOLIO_KB[0], bestScore = 0;

  PORTFOLIO_KB.forEach(entry => {
    const score = entry.keys.reduce((acc, k) => acc + (qWords.some(w => w.includes(k) || k.includes(w)) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = entry; }
  });

  const reply = bestScore > 0
    ? best.ans
    : 'I answer strictly from Priyanka Saini’s verified profile! Ask about her experience at National Australia Bank & Deutsche Bank, BITS Pilani Economics & Management education, R/SQL/Python/Stata skills, or research projects.';

  log.innerHTML += `<div style="margin-top:0.55rem; color:var(--text);"><strong>You:</strong> ${question}</div>`;
  log.innerHTML += `<div style="margin-top:0.25rem; color:var(--accent-green);"><strong>Assistant:</strong> ${reply}</div>`;
  log.scrollTop = log.scrollHeight;
}

const PALETTE_COMMANDS = [
  { label: '💼 Open LinkedIn Profile (Priyanka Saini)', action: () => window.open('https://in.linkedin.com/in/priyanka-saini-2b8219195', '_blank') },
  { label: '📄 Download Resume PDF (resume_Priyanka.pdf)', action: () => window.open('resume_Priyanka.pdf', '_blank') },
  { label: '📊 Jump to Credit Risk & Econometrics Labs', action: () => window.location.href = 'labs.html' },
  { label: '🎓 Jump to 1-on-1 Economics & Finance Tutoring', action: () => document.getElementById('tutoring')?.scrollIntoView({ behavior: 'smooth' }) },
  { label: '📚 Open Economics & Finance Blog Archive', action: () => window.location.href = 'blog.html' },
  { label: '📋 Open 1-Page Executive Capabilities Summary', action: () => window.location.href = 'capabilities.html' },
  { label: '✉️ Copy Email (priyasaini202004@gmail.com)', action: () => copyEmail() },
  { label: '📞 Copy Phone (+91 9602591005)', action: () => copyPhone() },
  { label: '🌓 Toggle Dark / Light Theme', action: () => toggleTheme() }
];

function toggleCommandPalette() {
  const modal = document.getElementById('cmdPaletteBackdrop');
  if (!modal) return;
  if (modal.classList.contains('open')) {
    modal.classList.remove('open');
  } else {
    modal.classList.add('open');
    const inp = document.getElementById('cmdSearchInput');
    if (inp) { inp.value = ''; inp.focus(); }
    filterCommands('');
  }
}

function filterCommands(q) {
  const list = document.getElementById('cmdList');
  if (!list) return;
  const term = (q || '').toLowerCase();
  const matches = PALETTE_COMMANDS.filter(c => c.label.toLowerCase().includes(term));
  list.innerHTML = matches.map(c => `<button type="button" class="btn btn-glass btn-sm" style="justify-content:flex-start; width:100%;" onclick="toggleCommandPalette(); PALETTE_COMMANDS[${PALETTE_COMMANDS.indexOf(c)}].action();">${c.label}</button>`).join('');
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    toggleCommandPalette();
  } else if (e.key === 'Escape') {
    const modal = document.getElementById('cmdPaletteBackdrop');
    if (modal?.classList.contains('open')) modal.classList.remove('open');
  }
});

function initEconFinanceCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const symbols = ['₹', '$', '%', '∑', 'β', 'α', 'σ', 'Δ', 'μ', 'λ'];
  const shapes = [
    { type: 'triangle', name: 'Supply & Demand Equilibrium (△) — Where marginal benefit equals marginal cost!', x: w * 0.14, y: h * 0.24, r: 26, vx: 0.16, vy: 0.11 },
    { type: 'circle',   name: 'Efficient Frontier (○) — Optimal portfolio return for a given level of risk (σ)!', x: w * 0.84, y: h * 0.22, r: 24, vx: -0.14, vy: 0.15 },
    { type: 'square',   name: 'Balance Sheet Identity (□) — Assets = Liabilities + Shareholders’ Equity!', x: w * 0.18, y: h * 0.74, r: 24, vx: 0.13, vy: -0.13 },
    { type: 'hexagon',  name: 'Global Value Chain Network (⬡) — Interconnected cross-border trade & ESG resilience!', x: w * 0.82, y: h * 0.72, r: 26, vx: -0.15, vy: -0.11 }
  ];

  const floaters = Array.from({ length: 24 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -0.1 - Math.random() * 0.18,
    sym: symbols[Math.floor(Math.random() * symbols.length)],
    size: 16 + Math.floor(Math.random() * 8)
  }));

  let mouseX = -999, mouseY = -999;
  const tip = document.getElementById('shapeTooltip');

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!tip) return;
    const hit = shapes.find(s => Math.hypot(mouseX - s.x, mouseY - s.y) <= s.r + 12);
    if (hit) {
      tip.style.display = 'block';
      tip.style.left = Math.min(window.innerWidth - 310, mouseX + 14) + 'px';
      tip.style.top = (mouseY + 14) + 'px';
      tip.textContent = '📈 ' + hit.name;
    } else {
      tip.style.display = 'none';
    }
  });

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  function drawPolygon(sides, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const ang = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const px = x + r * Math.cos(ang);
      const py = y + r * Math.sin(ang);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isLight ? 'rgba(29, 78, 216, 0.18)' : 'rgba(56, 189, 248, 0.20)';

    floaters.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      if (f.y < -20) { f.y = h + 20; f.x = Math.random() * w; }
      if (f.x < -20) f.x = w + 20;
      if (f.x > w + 20) f.x = -20;
      ctx.font = `600 ${f.size}px "Fira Code", monospace`;
      ctx.fillText(f.sym, f.x, f.y);
    });

    shapes.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 40 || s.x > w - 40) s.vx *= -1;
      if (s.y < 80 || s.y > h - 40) s.vy *= -1;

      const hovered = Math.hypot(mouseX - s.x, mouseY - s.y) <= s.r + 12;
      ctx.strokeStyle = hovered ? '#f59e0b' : (isLight ? 'rgba(29, 78, 216, 0.30)' : 'rgba(251, 191, 36, 0.32)');
      ctx.lineWidth = hovered ? 2.5 : 1.5;

      if (s.type === 'circle') { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.stroke(); }
      else if (s.type === 'triangle') { drawPolygon(3, s.x, s.y, s.r); ctx.stroke(); }
      else if (s.type === 'square') { drawPolygon(4, s.x, s.y, s.r); ctx.stroke(); }
      else { drawPolygon(6, s.x, s.y, s.r); ctx.stroke(); }
    });

    requestAnimationFrame(animate);
  }
  animate();
}

const ECON_FUN_FACTS = [
  { title: '📊 The Rule of 72 in Finance', text: 'Divide 72 by your annual interest rate to estimate how many years it takes for an investment to double (e.g., at 8% return, 72 ÷ 8 = 9 years)!' },
  { title: '⚖️ Price Elasticity & Energy Markets', text: 'In the short run, energy demand is relatively inelastic—meaning consumers take time to adjust habits after policy or price shifts, while long-run elasticity is much higher!' },
  { title: '🏦 Why Liquidity Matters Alongside Solvency', text: 'A profitable company can still face distress if short-term liabilities outpace liquid cash flows—which is why credit analysts monitor both Current Ratio and Interest Coverage!' },
  { title: '🌐 Global Value Chains (GVCs)', text: 'Over 70% of international trade today involves Global Value Chains, where raw materials, services, and components cross multiple borders before final assembly!' },
  { title: '📈 Diversification & Portfolio Beta (β)', text: 'Combining assets whose returns are not perfectly correlated reduces unsystematic portfolio risk without necessarily sacrificing expected return!' }
];
let funFactIdx = 0;

function nextEconFunFact() {
  const titleEl = document.getElementById('funFactTitle');
  const textEl = document.getElementById('funFactText');
  if (!titleEl || !textEl) return;
  funFactIdx = (funFactIdx + 1) % ECON_FUN_FACTS.length;
  titleEl.textContent = ECON_FUN_FACTS[funFactIdx].title;
  textEl.textContent = ECON_FUN_FACTS[funFactIdx].text;
}

document.addEventListener('DOMContentLoaded', () => {
  initEconFinanceCanvas();
  if (typeof updateSprintEstimate === 'function') updateSprintEstimate();
  if (typeof updateTutorEstimate === 'function') updateTutorEstimate();
});