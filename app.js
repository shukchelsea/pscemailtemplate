/* ═══════════════════════════════════════════════════════════════
   FET.my — app.js
   Real-time email template engine
   ═══════════════════════════════════════════════════════════════ */

// ── STATE ──────────────────────────────────────────────────────
let selCat  = null;   // selected category object
let selSit  = null;   // selected situation string
let mode    = 'courier'; // 'courier' | 'seller'
let liveTimer = null; // debounce handle

// ── BOOT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('');
  setTodayDate();
  bindFormInputs();
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') gen();
  });
});

function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('f_dt').value = today;
}

// ── BIND FORM INPUTS for live green highlight ──────────────────
function bindFormInputs() {
  const ids = ['f_ord','f_trk','f_cur','f_snm','f_sid','f_dt','f_xtr','f_cc'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      el.classList.toggle('has-val', el.value.trim().length > 0);
      liveUpdate();
    });
    el.addEventListener('change', () => {
      el.classList.toggle('has-val', el.value.trim().length > 0);
      liveUpdate();
    });
  });
}

// ── MODE ───────────────────────────────────────────────────────
function setMode(m) {
  mode = m;
  document.getElementById('tC').className = 'tab-btn' + (m === 'courier' ? ' ac' : '');
  document.getElementById('tS').className = 'tab-btn' + (m === 'seller'  ? ' as' : '');
  document.getElementById('gBtn').className = 'btn-gen' + (m === 'seller' ? ' sm' : '');
  document.getElementById('outBox').classList.toggle('sm', m === 'seller');
  liveUpdate();
}

// ── SIDEBAR ────────────────────────────────────────────────────
function buildSidebar(q) {
  q = (q || '').toLowerCase().trim();
  const list = document.getElementById('catList');
  list.innerHTML = '';

  const groups = {};
  CATS.forEach(cat => {
    const matchCat = !q ||
      cat.label.toLowerCase().includes(q) ||
      cat.code.includes(q) ||
      cat.group.toLowerCase().includes(q) ||
      cat.tag.toLowerCase().includes(q);
    const matchedSits = !q
      ? cat.situations
      : cat.situations.filter(s => s.toLowerCase().includes(q));
    if (!matchCat && !matchedSits.length) return;

    const g = cat.group;
    if (!groups[g]) groups[g] = [];
    groups[g].push({
      cat,
      sitsToShow: (q && !matchCat) ? matchedSits : cat.situations
    });
  });

  const gkeys = Object.keys(groups);
  if (!gkeys.length) {
    list.innerHTML = `<div class="no-results">No results for "<strong>${escHtml(q)}</strong>"<br>
      <span style="font-size:10px;opacity:0.6">Try: code, category name, or situation keyword</span></div>`;
    return;
  }

  gkeys.forEach(g => {
    const gDiv = document.createElement('div');
    gDiv.className = 'cat-group';
    const hdr = document.createElement('div');
    hdr.className = 'cat-group-hdr';
    hdr.textContent = g;
    gDiv.appendChild(hdr);

    groups[g].forEach(({ cat, sitsToShow }) => {
      const isSel  = selCat && selCat.code === cat.code;
      const isOpen = isSel || !!q;

      // Parent row
      const par = document.createElement('div');
      par.className = 'cat-parent' + (isOpen ? ' open' : '') + (isSel ? ' has-sel' : '');

      const arrow = document.createElement('span');
      arrow.className = 'cat-arrow';
      arrow.textContent = '▶';

      const inner = document.createElement('div');
      inner.className = 'cat-inner';
      inner.innerHTML = `<span class="cat-code">${cat.code}</span><span class="cat-name">${escHtml(cat.label)}</span>`;

      par.appendChild(arrow);
      par.appendChild(inner);
      par.addEventListener('click', () => par.classList.toggle('open'));

      // Sub-situations container
      const subs = document.createElement('div');
      subs.className = 'cat-subs';

      sitsToShow.forEach(sit => {
        const isActiveSub = isSel && selSit === sit;
        const sub = document.createElement('div');
        sub.className = 'cat-sub' + (isActiveSub ? ' active' : '');

        const dot = document.createElement('span');
        dot.className = 'cat-sub-dot';

        const txt = document.createElement('span');
        txt.textContent = sit;

        sub.appendChild(dot);
        sub.appendChild(txt);

        // ★ CLICK → instant generate
        sub.addEventListener('click', e => {
          e.stopPropagation();
          pickItem(cat, sit);
        });

        subs.appendChild(sub);
      });

      gDiv.appendChild(par);
      gDiv.appendChild(subs);
    });

    list.appendChild(gDiv);
  });
}

// ── PICK ITEM (situation click → instant generate) ─────────────
function pickItem(cat, sit) {
  selCat = cat;
  selSit = sit;

  // Update header tag
  document.getElementById('selTagTxt').textContent = `${cat.code} · ${cat.tag}`;
  document.getElementById('selSitTxt').textContent = sit ? ` ↳ ${sit}` : '';
  document.getElementById('selTag').classList.add('visible');

  // Rebuild sidebar to reflect selection
  buildSidebar(document.getElementById('si').value);

  // Scroll active sub into view
  requestAnimationFrame(() => {
    const active = document.querySelector('.cat-sub.active');
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  // ★ GENERATE IMMEDIATELY
  gen();

  // Activate live indicator
  document.getElementById('liveIndicator').classList.add('active');
}

// ── LIVE UPDATE (debounced on form input) ─────────────────────
function liveUpdate() {
  if (!selCat) return; // nothing selected yet, skip
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => {
    renderTemplate(false); // false = no animation on every keystroke
  }, 80); // 80ms debounce — fast but not every single keypress
}

// ── GENERATE (manual button / keyboard shortcut) ──────────────
function gen() {
  if (!selCat) {
    alert('Please select a category and situation from the left panel.');
    return;
  }
  renderTemplate(true); // true = with animation
}

// ── CORE RENDER ───────────────────────────────────────────────
function renderTemplate(animate) {
  if (!selCat) return;

  const today = new Date().toISOString().split('T')[0];

  const vals = {
    orderNo:        v('f_ord')  || '[ORDER NUMBER]',
    trackingNo:     v('f_trk')  || '[TRACKING NUMBER]',
    courier:        v('f_cur')  || '[COURIER NAME]',
    sellerName:     v('f_snm')  || '[SELLER NAME]',
    sellerCode:     v('f_sid')  || '[SELLER CODE]',
    incidentDate:   v('f_dt')   || today,
    extraDetails:   v('f_xtr')  || '[Please provide additional details]',
    courierContact: v('f_cc')   || '',
    situation:      selSit      || '[Situation not specified]',
  };

  const fill = str => str.replace(/\{(\w+)\}/g, (_, k) =>
    (vals[k] !== undefined && vals[k] !== '') ? vals[k] : `[${k.toUpperCase().replace(/([A-Z])/g,' $1').trim()}]`
  );

  const sk = mode === 'courier' ? 'cs' : 'ss';
  const bk = mode === 'courier' ? 'cb' : 'sb';

  const subject = fill(selCat[sk] || '');
  const body    = fill(selCat[bk] || '');

  // Subject row
  document.getElementById('subjVal').textContent = subject;
  document.getElementById('subjRow').style.display = 'flex';

  // Body
  const out = document.getElementById('emailOut');
  if (animate) {
    out.classList.remove('ai');
    void out.offsetWidth;
    out.className = 'email-body ai';
  } else {
    out.className = 'email-body';
  }
  out.textContent = body;

  // Store for copy
  out.dataset.subj = subject;
  out.dataset.body = body;

  // Mode badges
  document.getElementById('mbC').classList.toggle('show', mode === 'courier');
  document.getElementById('mbS').classList.toggle('show', mode === 'seller');

  // Flash border on live update
  if (!animate) {
    const box = document.getElementById('outBox');
    box.classList.remove('updated');
    void box.offsetWidth;
    box.classList.add('updated');
    setTimeout(() => box.classList.remove('updated'), 600);
  }
}

// ── HELPERS ───────────────────────────────────────────────────
function v(id) {
  return document.getElementById(id).value.trim();
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── COPY ──────────────────────────────────────────────────────
function cpyBody() {
  const b = document.getElementById('emailOut').dataset.body;
  if (!b) return;
  navigator.clipboard.writeText(b).then(() => {
    const btn = document.getElementById('cpBtn');
    btn.textContent = '✓ Copied!';
    btn.classList.add('ok');
    setTimeout(() => { btn.textContent = 'Copy Body'; btn.classList.remove('ok'); }, 2000);
  });
}

function cpySubj() {
  const s = document.getElementById('emailOut').dataset.subj;
  if (!s) return;
  navigator.clipboard.writeText(s).then(() => {
    const btn = document.getElementById('csBtn');
    btn.textContent = '✓ Copied!';
    btn.classList.add('ok');
    setTimeout(() => { btn.textContent = 'Copy Subject'; btn.classList.remove('ok'); }, 2000);
  });
}

// ── CLEAR ALL ─────────────────────────────────────────────────
function clrAll() {
  ['f_ord','f_trk','f_cur','f_snm','f_sid','f_xtr','f_cc'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    el.classList.remove('has-val');
  });
  setTodayDate();

  // If template is active, re-render with cleared values
  if (selCat) {
    renderTemplate(true);
  } else {
    resetOutput();
  }
}

function resetOutput() {
  const out = document.getElementById('emailOut');
  out.innerHTML = `<div class="ph">
    <div class="ph-icon">✉️</div>
    <div class="ph-title">Select a situation to get started</div>
    <div class="ph-steps">
      <div class="ph-step">① Click any situation in the left panel → template generates instantly</div>
      <div class="ph-step">② Switch between 📦 Courier and 🏪 Seller tabs</div>
      <div class="ph-step">③ Fill in the form fields above → template updates live</div>
      <div class="ph-step">④ Copy Subject or Body when ready</div>
    </div>
  </div>`;
  out.dataset.body = '';
  out.dataset.subj = '';
  document.getElementById('subjRow').style.display = 'none';
  document.getElementById('mbC').classList.remove('show');
  document.getElementById('mbS').classList.remove('show');
}

// ── SEARCH ────────────────────────────────────────────────────
function clrSearch() {
  const inp = document.getElementById('si');
  inp.value = '';
  document.getElementById('sclr').classList.remove('show');
  document.getElementById('sico').style.display = 'block';
  buildSidebar('');
}

document.addEventListener('DOMContentLoaded', () => {
  const si = document.getElementById('si');
  si.addEventListener('input', function() {
    const q = this.value;
    document.getElementById('sclr').classList.toggle('show', !!q);
    document.getElementById('sico').style.display = q ? 'none' : 'block';
    buildSidebar(q);
  });
});
