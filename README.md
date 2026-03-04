# FET.my — Free Email Template

> **Partner Support Center · Malaysia**  
> Instant email template generator for E-Commerce logistics support teams.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-orange?style=flat-square)](https://yourusername.github.io/fet-my)
![HTML](https://img.shields.io/badge/HTML5-pure-blue?style=flat-square)
![No Dependencies](https://img.shields.io/badge/dependencies-none-green?style=flat-square)

---

## What is FET.my?

FET.my is a browser-based email template generator built for **Partner Support Center (PSC)** agents working in Malaysian e-commerce logistics. It covers **15 category groups**, **31 issue types**, and **80+ specific situations** — all generating professional email templates instantly.

---

## Features

- ⚡ **Instant generation** — click any situation and the template appears immediately
- 🔄 **Live preview** — form fields update the template in real-time as you type
- 📦 **Dual mode** — separate templates for `To Courier` and `To Seller`
- 🔍 **Search** — filter by category name, code, or specific situation keyword
- 📋 **One-click copy** — copy Subject and Body separately
- 🌙 **Dark UI** — easy on the eyes for long shifts
- 📴 **No backend required** — pure HTML/CSS/JS, works offline

---

## Coverage

| # | Category | Situations |
|---|----------|-----------|
| 1 | Delivery & Shipment Issues | 18 |
| 2 | Tracking & System Issues | 9 |
| 3 | Pickup Issues | 8 |
| 4 | Return to Sender (RTS) | 7 |
| 5 | Damage & Packaging | 7 |
| 6 | Rider / Courier Conduct | 8 |
| 7 | Address & Routing Issues | 6 |
| 8 | Capacity & Peak Issues | 6 |
| 9 | Customs & Cross-Border | 6 |
| 10 | Compensation & Claims | 6 |
| 11 | Warehouse / Fulfilment | 6 |
| 12 | Payment & COD Issues | 5 |
| 13 | Policy & Compliance | 4 |
| 14 | Escalation Scenarios | 6 |
| 15 | Force Majeure | 5 |

---

## How to Use

### Option 1 — GitHub Pages (Recommended)

1. Fork this repository
2. Go to **Settings → Pages**
3. Set Source to **Deploy from branch → main → / (root)**
4. Visit `https://yourusername.github.io/fet-my`

### Option 2 — Run Locally

```bash
git clone https://github.com/yourusername/fet-my.git
cd fet-my
# Open index.html in your browser — no server needed
open index.html
```

### Option 3 — Download & Use

Download the ZIP from GitHub and open `index.html` directly in any modern browser.

---

## Project Structure

```
fet-my/
├── index.html          # Main application shell
├── css/
│   └── style.css       # All styles
├── js/
│   ├── data.js         # All 31 categories + 80+ situations + email templates
│   └── app.js          # Application logic (sidebar, live render, copy, search)
├── README.md
├── LICENSE
└── .gitignore
```

---

## How It Works

1. **Select a situation** from the left sidebar → template generates instantly
2. **Fill in the form** (Order No, Tracking No, Seller Name, etc.) → template updates live as you type
3. **Switch mode** between `📦 To Courier` and `🏪 To Seller` for context-appropriate templates
4. **Copy** the Subject and Body separately with one click

### Template Variables

Each template uses `{variable}` placeholders that are replaced in real-time:

| Variable | Source |
|----------|--------|
| `{orderNo}` | Order Number field |
| `{trackingNo}` | Tracking Number field |
| `{courier}` | Courier / Partner field |
| `{sellerName}` | Seller Name field |
| `{sellerCode}` | Seller Short Code / ID field |
| `{incidentDate}` | Date of Incident (defaults to today) |
| `{extraDetails}` | Additional Details / Notes field |
| `{situation}` | Selected situation from sidebar |

---

## Customisation

### Adding New Templates

Edit `js/data.js` and add a new object to the `CATS` array:

```javascript
{
  code: "16.1",
  group: "16. Your New Category",
  label: "Short Label",
  tag: "Tag – Sub-tag",
  situations: [
    "Situation one",
    "Situation two",
  ],
  cs: "Courier Subject: {orderNo}",        // cs = courier subject
  cb: `Courier body template {sellerName}`, // cb = courier body
  ss: "Seller Subject: {orderNo}",          // ss = seller subject
  sb: `Seller body template {sellerName}`,  // sb = seller body
}
```

### Changing Styles

All design tokens (colours, fonts, spacing) are CSS variables in `css/style.css`:

```css
:root {
  --accent: #f97316;          /* Orange — primary accent */
  --accent-seller: #a855f7;   /* Purple — seller mode */
  --bg: #0d0f14;              /* Dark background */
  --sidebar-w: 300px;         /* Sidebar width */
}
```

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |

Requires `navigator.clipboard` API for copy functionality (HTTPS or localhost).

---

## License

MIT License — free to use, modify, and distribute.

---

## Contributing

Pull requests welcome. For major changes, please open an issue first.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

*Built for Malaysian e-commerce Partner Support Center teams.*
