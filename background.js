console.log('D&D Beyond Augmented: Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('D&D Beyond Augmented: Extension installed');
});
