chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "AUTOFILL_LINKEDIN_POST") {
    return;
  }

  const editor = document.querySelector("div[role='textbox']");
  if (!editor) {
    sendResponse({ ok: false, reason: "LinkedIn editor not found" });
    return;
  }

  editor.focus();
  document.execCommand("insertText", false, message.payload || "");
  sendResponse({ ok: true });
});
