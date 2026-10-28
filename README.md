# Public Document Library

A static document library built with HTML, CSS, JavaScript and JSON. Host on GitHub Pages.

## Run locally

Because JavaScript loads `documents.json` with `fetch()`, do **not** double-click `index.html` and use a `file://` URL. Start a local HTTP server:

- VS Code: install the **Live Server** extension, open this folder, right-click `index.html`, and select **Open with Live Server**.
- Or, if Python is installed: run `python -m http.server 8000` from this folder, then open http://localhost:8000/.

## Add a document

1. Upload a file to `files/` in your GitHub repository (use **Add file > Upload files** inside the folder).
2. Edit `documents.json` and add a new object, keeping valid JSON syntax:

```json
{
  "title": "My Report",
  "description": "A short description.",
  "category": "Reports",
  "type": "pdf",
  "file": "files/my-report.pdf"
}
```

3. Commit both changes. Wait for GitHub Pages to redeploy.
4. Use simple ASCII filenames without special characters for easiest links.

## Deploy

Create a **public** GitHub repository and upload the *contents* of this folder to its root. Under **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/(root)`. Your site will be at `https://YOURNAME.github.io/REPOSITORY/`.

## Important

All files in the public repository are public. Only publish files you are permitted to distribute. Browser PDF display and the `download` attribute are browser-dependent. No login or website-based upload is implemented.
