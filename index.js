'use strict';

var visit = require('unist-util-visit');
var position = require('unist-util-position');
var toString = require('nlcst-to-string');

module.exports = mentions;

var name = /^(?:[a-z0-9]{1,2}|[a-z0-9][a-z0-9-]{1,37}[a-z0-9])$/;

function mentions() {
  return function (tree) {
    visit(tree, 'SymbolNode', function (node, index, parent) {
      var siblings = parent.children;
      var offset = index;

      if (toString(node) !== '@') {
        return;
      }

      if (!name.test(toString(siblings[++offset]))) {
        return;
      }

      if (
        toString(siblings[offset + 1]) === '/' &&
        name.test(toString(siblings[offset + 2]))
      ) {
        offset += 2;
      }

      siblings.splice(index, offset - index + 1, {
        type: 'SourceNode',
        value: toString(siblings.slice(index, offset + 1)),
        position: {
          start: position.start(node),
          end: position.end(siblings[offset])
        }
      });
    });
  };
}
