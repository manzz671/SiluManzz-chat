//utils.js
function escapeHtml(str) {
  return str
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");
}

function toHyperLink(text) {
  let escaped = escapeHtml(text)
  let withLinks = escaped.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    return withLinks.replace(/\n/g, '<br/>')
}

window.toHyperLink = toHyperLink;
