const open_tab = () => {
  chrome.tabs.create({url: chrome.runtime.getURL('index.html')});
}

chrome.action.onClicked.addListener(tab => open_tab());
chrome.runtime.onInstalled.addListener(x => open_tab());
