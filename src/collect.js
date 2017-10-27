import extract from './extract.js';

extract('jsonld', (err, output) => {
  let json = JSON.stringify(output, null, 2);
  // tell the popup we've got the goods
  browser.runtime.sendMessage({
    jsonld: json
  });
});

extract('turtle', (err, output) => {
  // tell the popup we've got the goods
  browser.runtime.sendMessage({
    turtle: output
  });
});

extract('refs', (err, output) => {
  browser.runtime.sendMessage({
    refs: output
  });
});
