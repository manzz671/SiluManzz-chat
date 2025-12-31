// app.js
const chatEl = document.getElementById('chat-messages');
const formEl = document.getElementById('input-form');
const inputEl = document.getElementById('user-input');
const typingEl = document.getElementById('typing');
const menuBtn = document.getElementById('menu-btn');
const menuDropdown = document.getElementById('menu-dropdown');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalRoot = document.getElementById('modal-root');

const STORAGE_KEY = 'ai_chat_history_v1';
const MAX_HISTORY = 20;
const systemChar = `Namamu SiluManzz. Bicaralah dengan santai`;

let messages = loadHistory();
messages.forEach(m => renderMessage(m.content, m.role));

// menu pojokan
menuBtn.addEventListener('click', () => {
  menuDropdown.classList.toggle("open");
});
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
    menuDropdown.classList.remove("open");
  }
});
menuDropdown.querySelectorAll('.menu-item').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

// submit form
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  pushMessage("user", text);
  renderMessage(text, "user");
  inputEl.value = '';
  inputEl.style.height = 'auto';
  setTyping(true);

  try {
    const history = messages.slice(-MAX_HISTORY);
    const conversation = history
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join("\n");
    const q = `${conversation}\nUser: ${text}\nAssistant:`;

    let url = `https://text.pollinations.ai/${encodeURIComponent(q)}?system=${encodeURIComponent(systemChar)}`;
    let res = await fetch(url, { method: 'GET' });
    let aiText = await res.text();

    pushMessage("assistant", aiText);
    renderMessage(aiText, "assistant");
  } catch (err) {
    let erMsg = "Maaf. Terjadi error saat mengambil jawaban. Debug: " + String(err);
    pushMessage('assistant', erMsg);
    renderMessage(erMsg, 'assistant');
  } finally {
    setTyping(false);
  }
});

// auto re-size textarea
inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 160) + 'px';
});

// helpers
function setTyping(on) {
  typingEl.classList.toggle('show', on);
}

function pushMessage(role, content) {
  messages.push({ role, content });
  if (messages.length > MAX_HISTORY) messages = messages.slice(-MAX_HISTORY);
  saveHistory(messages);
}

function renderMessage(text, role) {
  const div = document.createElement('div');
  div.className = `message ${role === 'user' ? 'user' : 'ai'}`;

  const isCodeFence = text.startsWith('```') && text.endsWith('```');
  if (isCodeFence) {
    const code = text.slice(3, -3).trim();
    const pre = document.createElement('pre');
    const codeEl = document.createElement('code');
    codeEl.textContent = code;
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(code);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
    });
    pre.appendChild(codeEl);
    pre.appendChild(copyBtn);
    div.appendChild(pre);
  } else {
    div.innerHTML = toHyperlink(text);
  }

  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.slice(-MAX_HISTORY);
  } catch {
    return [];
  }
}

function saveHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// modal launcher
async function openModal(kind) {
  const map = { help: 'help.html', report: 'report.html', contact: 'contact.html' };
  const url = map[kind];
  if (!url) return;

  try {
    const res = await fetch(url);
    const html = await res.text();
    modalRoot.innerHTML = html;
    modalRoot.hidden = false;
    modalBackdrop.hidden = false;

    const scriptMap = { help: 'help.js', report: 'report.js', contact: 'contact.js' };
    const scriptUrl = scriptMap[kind];
    if (scriptUrl) {
      await import(`./${scriptUrl}`);
    }

    const closeBtn = modalRoot.querySelector('[data-close]');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
  } catch (err) {
    alert("Gagal membuka modal: " + String(err));
  }
}

function closeModal() {
  modalBackdrop.hidden = true;
  modalRoot.hidden = true;
  modalRoot.innerHTML = '';
}
