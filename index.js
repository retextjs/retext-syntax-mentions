'use strict'

var visit = require('unist-util-visit')
var position = require('unist-util-position')
var toString = require('nlcst-to-string')

module.exports = mentions

var name = /^(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d])(['’]s)?$/i

function mentions() {
  return transform
}

function transform(tree) {
  visit(tree, 'SymbolNode', visitor)
}

function visitor(node, index, parent) {
  var siblings = parent.children
  var offset = index

  if (toString(node) !== '@') {
    return
  }

  if (!name.test(valueOf(siblings[++offset]))) {
    return
  }

  if (
    valueOf(siblings[offset + 1]) === '/' &&
    name.test(valueOf(siblings[offset + 2]))
  ) {
    offset += 2
  }

  siblings.splice(index, offset - index + 1, {
    type: 'SourceNode',
    value: toString(siblings.slice(index, offset + 1)),
    position: {
      start: position.start(node),
      end: position.end(siblings[offset])
    }
  })
}

function valueOf(node) {
  return node ? toString(node) : ''
}
