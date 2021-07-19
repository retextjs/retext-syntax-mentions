import {toString} from 'nlcst-to-string'
import {pointStart, pointEnd} from 'unist-util-position'
import {visit} from 'unist-util-visit'

var genitive = /['’]s?$/i

var gh =
  /^@(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d])(\/(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d]))?$/i
var tw = /^@\w{1,15}$/i

export default function retextSyntaxMentions(options) {
  var style = (options || {}).style || 'github'

  if (typeof style === 'string') {
    if (style === 'github') {
      style = gh
    } else if (style === 'twitter') {
      style = tw
    } else {
      throw new Error(
        'Expected known style (`github`, `twitter`), not `' + style + '`'
      )
    }
  }

  return transform

  function transform(tree) {
    visit(tree, 'SymbolNode', visitor)
  }

  function visitor(node, index, parent) {
    var siblings = parent.children
    var length = siblings.length
    var offset = index
    var slice

    if (toString(node) !== '@') {
      return
    }

    offset++

    while (offset <= length) {
      if (offset === length) break
      if (siblings[offset].type === 'WhiteSpaceNode') break

      if (
        toString(siblings[offset]) !== '/' &&
        !check(siblings.slice(index, offset + 1))
      ) {
        break
      }

      offset++
    }

    slice = siblings.slice(index, offset)

    if (!check(slice)) {
      return
    }

    siblings.splice(index, offset - index, {
      type: 'SourceNode',
      value: toString(slice),
      position: {
        start: pointStart(node),
        end: pointEnd(slice[slice.length - 1])
      }
    })
  }

  function check(nodes) {
    return style.test(toString(nodes).replace(genitive, ''))
  }
}
