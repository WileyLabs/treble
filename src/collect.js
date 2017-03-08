import extract from './extract-and-compact.js';

extract('jsonld', (err, output) => {
  let json = JSON.stringify(output, null, 2);
  // tell the popup we've got the goods
  chrome.runtime.sendMessage({
    jsonld: json
  });
});

extract('turtle', (err, output) => {
  // tell the popup we've got the goods
  chrome.runtime.sendMessage({
    turtle: output
  });
});
