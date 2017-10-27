import jsonld from './jsonld-rdfa.js';
import getRdfaGraph from 'graph-rdfa-processor';
// calls the callback; no return value
// TODO: switch to Promises
export default function(as, callback) {
  switch (as) {
    case 'refs':
      let meta = document.querySelectorAll('meta');
      let links = document.querySelectorAll('link[href]');
      let anchors = document.querySelectorAll('a[href]');
      callback(null, {
        meta,
        links,
        anchors
      }.toString());
      break;
    case 'turtle':
      let graph = getRdfaGraph(document);
      callback(null, graph.toString());
      break;
    case 'jsonld':
    default:
      jsonld.fromRDF(document, {format: 'text/html'}, (err, data) => {
        if (err) console.error(err);
        jsonld.compact(data,
          // default context from RDFa 1.1 spec
          {'@context': ['https://www.w3.org/2013/json-ld-context/rdfa11',
            // plus a common prefix I personally like ^_^
            {oa: 'http://www.w3.org/ns/oa#'}
          ]},
          callback
        );
      });
      break;
  }
};
