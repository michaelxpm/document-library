"use strict";

const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const typeSelect = document.querySelector("#filetype");
const documentList = document.querySelector("#document-list");
const count = document.querySelector("#count");
const status = document.querySelector("#status");
let documents = [];

// Only permit local, relative file paths under files/.
function safeFilePath(path) {
  if (typeof path !== "string") return null;

  const parts = path.split("/");

  // Only allow files inside the files/ directory
  if (parts[0] !== "files" || parts.length < 2) {
    return null;
  }

  // Prevent empty segments and directory traversal
  if (parts.some(part =>
    part === "" || part === "." || part === ".."
  )) {
    return null;
  }

  // Prevent query strings, fragments and backslashes
  if (/[?#\\\u0000-\u001F\u007F]/.test(path)) {
    return null;
  }

  // Encode Chinese characters, spaces and punctuation
  return parts.map(encodeURIComponent).join("/");
}

function makeOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  return option;
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const category = categorySelect.value;
  const type = typeSelect.value;
  const matches = documents.filter(doc =>
    (doc.title + " " + doc.description).toLocaleLowerCase().includes(query) &&
    (category === "all" || doc.category === category) &&
    (type === "all" || doc.type.toLowerCase() === type)
  );

  documentList.replaceChildren();
  count.textContent = `${matches.length} of ${documents.length} documents`;
  status.textContent = matches.length ? "" : "No matching documents found.";

  for (const doc of matches) {
    const card = document.createElement("article");
    card.className = "document-card";
    const heading = document.createElement("h3");
    heading.textContent = doc.title;
    const description = document.createElement("p");
    description.textContent = doc.description;
    const meta = document.createElement("div");
    meta.className = "meta";
    for (const label of [doc.category, doc.type.toUpperCase()]) {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = label;
      meta.append(pill);
    }
    const actions = document.createElement("div");
    actions.className = "actions";
    const filePath = safeFilePath(doc.file);
    if (filePath) {
      const view = document.createElement("a");
      view.className = "primary";
      view.href = filePath;
      view.target = "_blank";
      view.rel = "noopener noreferrer";
      view.textContent = doc.type.toLowerCase() === "pdf" ? "View PDF" : "Open file";
      const download = document.createElement("a");
      download.href = filePath;
      download.download = "";
      download.textContent = "Download";
      actions.append(view, download);
    }
    card.append(heading, description, meta, actions);
    documentList.append(card);
  }
}

async function init() {
  try {
    const response = await fetch("documents.json", {cache: "no-store"});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Catalogue must be a JSON array.");
    documents = data.filter(doc => doc &&
      ["title", "description", "category", "type", "file"].every(k => typeof doc[k] === "string") &&
      safeFilePath(doc.file));
    const categories = [...new Set(documents.map(d => d.category))].sort();
    const types = [...new Set(documents.map(d => d.type.toLowerCase()))].sort();
    for (const c of categories) categorySelect.append(makeOption(c));
    for (const t of types) typeSelect.append(makeOption(t));
    render();
  } catch (error) {
    status.textContent = "Could not load documents. Run this site using a local web server (not file://), and check documents.json. Details: " + error.message;
    count.textContent = "";
  }
}

for (const control of [searchInput, categorySelect, typeSelect]) {
  control.addEventListener(control === searchInput ? "input" : "change", render);
}
init();
