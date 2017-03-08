// UX bits
$('.tabular.menu .item').tab();

// WebExtension cross-border communication
// add the downloader to the current page
chrome.tabs.executeScript(null, {
  file: 'lib/collect.js'
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ('turtle' in request) {
    document.getElementById('turtle').value = request.turtle;
  } else {
    document.getElementById('jsonld').value = request.jsonld;
  }
});
