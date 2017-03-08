chrome.contextMenus.create({
  id: 'download-json-ld',
  title: 'Download JSON-LD from RDFa',
  contexts: ['all']
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case 'download-json-ld':
      chrome.tabs.executeScript(tab.id, {
        file: 'lib/download.js'
      });
      break;
  }
});
