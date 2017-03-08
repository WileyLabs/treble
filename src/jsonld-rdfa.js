import jsonldRdfaParser from 'jsonld-rdfa-parser';
import jsonld from 'jsonld';

// register the parser for content type text/html
jsonld.registerRDFParser('text/html', jsonldRdfaParser);

export default jsonld;
