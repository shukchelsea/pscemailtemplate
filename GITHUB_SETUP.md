# 🚀 How to Upload FET.my to GitHub & Go Live

Follow these steps to publish FET.my as a live website using GitHub Pages (free).

---

## Step 1 — Create a GitHub Account
If you don't have one: https://github.com/signup

---

## Step 2 — Create a New Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `fet-my` (or any name you like)
   - **Description**: `Free Email Template for Partner Support Center MY`
   - **Visibility**: Public ✅ (required for free GitHub Pages)
   - Do NOT initialise with README (you already have one)
3. Click **Create repository**

---

## Step 3 — Upload the Files

### Option A — Upload via Browser (Easiest)

1. On your new empty repository page, click **"uploading an existing file"**
2. Drag and drop ALL files and folders:
   ```
   index.html
   README.md
   LICENSE
   .gitignore
   _config.yml
   css/
   js/
   .github/
   ```
3. Scroll down, add commit message: `Initial commit — FET.my v1`
4. Click **Commit changes**

### Option B — Upload via Git (Command Line)

```bash
# 1. Initialise git in the project folder
cd fet-my
git init
git add .
git commit -m "Initial commit — FET.my v1"

# 2. Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fet-my.git
git branch -M main
git push -u origin main
```

---

## Step 4 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**

---

## Step 5 — Access Your Live Site

Wait 1–2 minutes, then visit:
```
https://YOUR_USERNAME.github.io/fet-my
```

GitHub will also show the URL in **Settings → Pages** once it's live.

---

## Step 6 — Share the Link

Your FET.my is now live! Share the URL with your team.

You can bookmark it, add it to your browser home page, or pin it in your team's Slack/Teams channel.

---

## Updating the Site

Whenever you make changes:
1. Upload the modified files to GitHub (drag & drop or git push)
2. GitHub Pages automatically redeploys within ~1 minute

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Site shows 404 | Wait 2–3 minutes after enabling Pages |
| Old version showing | Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac) |
| Copy button not working | Make sure you're on HTTPS (not HTTP) |
| Fonts not loading | Check internet connection — fonts load from Google Fonts |

---

*For support, open an issue on the GitHub repository.*
