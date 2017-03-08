# Treble

Treble extracts triples from the Web while you browse.

[RDFa in HTML](https://www.w3.org/TR/html-rdfa/) is more common than people
think. [JSON-LD](http://json-ld.org/) is quickly becoming the *meaningful* data
format of choice for [Linked Data](https://en.wikipedia.org/wiki/Linked_data).

This extension provides a context menu option for downloading the RDFa-encoded
data hiding in HTML pages you browse everyday. Downloading the data as JSON-LD
gives you the option to add it to any JSON-based storage system
([Apache CouchDB](http://couchdb.apache.org/), [PouchDB](http://pouchdb.com),
etc) or add them to a "smarter" triple store such as
[Apache Marmotta](http://marmotta.apache.org/).

Additionally, the top-right corner browser action button allows you to view the
JSON-LD as well as other text formats (Turtle, etc.) of this graph-based data
hiding in the web pages you visit.

## Usage

Right now (as this isn't published in any of the various browser add-on sites),
you can use the add-on debugging tools in your browser to select the
`extension/manifest.json` file to load the extension in development mode. This
sets the extension up for both use and contribution. Handy. :smiley_cat:

## Development

The extension in this repo (which lives in the `extension/` directory) is ready
to run. However, if you want to contribute, you'll want to edit the `src/` fies
(which are ES6 files and have imports and cool magic bits).

To get started, run these commands in a console:
```
$ npm i -g browserify
$ npm i
$ npm run build
```

From then on, you can edit the `src/` files, and then `npm run build` and
reload the extension in the browser you prefer.

Have fun!

# License

[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
