// UX bits
$('.tabular.menu .item').tab();

// WebExtension cross-border communication
// add the downloader to the current page
browser.tabs.executeScript(null, {
  file: 'browser-polyfill.js'
});
browser.tabs.executeScript(null, {
  file: 'dist/collect.js'
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ('turtle' in request) {
    document.getElementById('turtle').value = request.turtle;
  } else {
    document.getElementById('jsonld').value = request.jsonld;
  }
});
