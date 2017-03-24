import extract from './extract.js';

extract('jsonld', (err, output) => {
  // create a download anchor tag for downloading on click
  let download = document.createElement('a');
  let ask = document.createElement('a');
  ask.onclick = function() {
    let filename = prompt('Name your JSON-LD file', 'doc.jsonld');
    if (filename !== null) {
      download.download = filename;
      download.click();
    }
  };

  let json = JSON.stringify(output, null, 2);
  let blob = new Blob([json], {type: 'application/ld+json'});
  download.href = window.URL.createObjectURL(blob);
  ask.click();
});
