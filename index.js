import {toString} from 'nlcst-to-string'
import {pointStart, pointEnd} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const genitive = /['’]s?$/i

const gh =
  /^@(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d])(\/(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d]))?$/i
const tw = /^@\w{1,15}$/i

export default function retextSyntaxMentions(options = {}) {
  const style = options.style || 'github'
  let styleRe

  if (style === null || style === undefined || style === 'github') {
    styleRe = gh
  } else if (style === 'twitter') {
    styleRe = tw
  } else if (typeof style === 'object' && 'exec' in style) {
    styleRe = style
  } else {
    throw new Error(
      'Expected known style (`github`, `twitter`), not `' + style + '`'
    )
  }

  return (tree) => {
    visit(tree, 'SymbolNode', (node, index, parent) => {
      const siblings = parent.children

      if (toString(node) !== '@') {
        return
      }

      let offset = index + 1

      while (offset < siblings.length) {
        if (siblings[offset].type === 'WhiteSpaceNode') break

        if (
          toString(siblings[offset]) !== '/' &&
          !check(siblings.slice(index, offset + 1))
        ) {
          break
        }

        offset++
      }

      const slice = siblings.slice(index, offset)

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
    })
  }

  function check(nodes) {
    return styleRe.test(toString(nodes).replace(genitive, ''))
  }
}
