// UX bits
$('.tabular.menu .item').tab();

// WebExtension cross-border communication
chrome.tabs.query({active: true, currentWindow: true},
  function(tabs) {
    // add the downloader to the current page
    chrome.tabs.executeScript(tabs[0].id, {
      file: 'lib/collect.js'
    });
  });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ('turtle' in request) {
    document.getElementById('turtle').value = request.turtle;
  } else {
    document.getElementById('jsonld').value = request.jsonld;
  }
});
