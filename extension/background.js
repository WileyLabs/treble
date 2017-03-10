browser.contextMenus.create({
  id: 'download-json-ld',
  title: 'Download JSON-LD from RDFa',
  contexts: ['all']
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case 'download-json-ld':
      browser.tabs.executeScript(tab.id, {
        file: 'lib/download.js'
      });
      break;
  }
});
