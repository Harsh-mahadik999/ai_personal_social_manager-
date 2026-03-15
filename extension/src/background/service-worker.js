chrome.runtime.onInstalled.addListener(() => {
  console.log("ProPost Assistant installed");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_STORED_TOKENS") {
    chrome.storage.local.get(["googleAccessToken", "linkedinAccessToken"], (tokens) => {
      sendResponse(tokens);
    });
    return true;
  }

  if (message.type === "REFRESH_GOOGLE_TOKEN") {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (chrome.runtime.lastError || !token) {
        sendResponse({ ok: false, error: chrome.runtime.lastError?.message || "refresh failed" });
        return;
      }
      chrome.storage.local.set({ googleAccessToken: token }, () => {
        sendResponse({ ok: true, token });
      });
    });
    return true;
  }

  return false;
});
