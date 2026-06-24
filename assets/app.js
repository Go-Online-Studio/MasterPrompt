const promptText = document.querySelector("#promptText");
const copyButton = document.querySelector("[data-copy]");
const downloadButton = document.querySelector("[data-download]");
const statusNode = document.querySelector("[data-status]");
const charCount = document.querySelector("[data-chars]");
const wordCount = document.querySelector("[data-words]");

function setStatus(message) {
  if (!statusNode) return;
  statusNode.textContent = message;
  window.clearTimeout(setStatus.timer);
  setStatus.timer = window.setTimeout(() => {
    statusNode.textContent = "";
  }, 2200);
}

function updateStats() {
  if (!promptText) return;
  const text = promptText.value.trim();
  if (charCount) charCount.textContent = `${text.length.toLocaleString()} characters`;
  if (wordCount) {
    const words = text ? text.split(/\s+/).length : 0;
    wordCount.textContent = `${words.toLocaleString()} words`;
  }
}

async function copyPrompt() {
  if (!promptText) return;
  const text = promptText.value;

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    promptText.focus();
    promptText.select();
    document.execCommand("copy");
    promptText.setSelectionRange(0, 0);
  }

  if (copyButton) {
    copyButton.classList.add("ok");
    const original = copyButton.textContent;
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = original;
      copyButton.classList.remove("ok");
    }, 1700);
  }

  setStatus("Prompt copied.");
}

function downloadPrompt() {
  if (!promptText || !downloadButton) return;
  const filename = downloadButton.getAttribute("data-filename") || "master-prompt.txt";
  const blob = new Blob([promptText.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  setStatus("Download started.");
}

if (copyButton) copyButton.addEventListener("click", copyPrompt);
if (downloadButton) downloadButton.addEventListener("click", downloadPrompt);
if (promptText) promptText.addEventListener("input", updateStats);
updateStats();
