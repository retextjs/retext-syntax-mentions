/**
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('nlcst').Sentence} Sentence
 * @typedef {import('nlcst').Word} Word
 * @typedef {import('nlcst').Source} Source
 * @typedef {import('nlcst').SentenceContent} SentenceContent
 * @typedef {import('nlcst').WordContent} WordContent
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {'github'|'twitter'|RegExp|null|undefined} [style='github']
 *   Style can be either `'github'` (for GitHub user and team mentions),
 *   `'twitter'` (for Twitter handles), or a regular expression (such as
 *   `/^@\w{1,15}$/i`, which is the Twitter regex).
 */

import {toString} from 'nlcst-to-string'
import {pointStart, pointEnd} from 'unist-util-position'
import {visit} from 'unist-util-visit'

const genitive = /['’]s?$/i

const gh =
  /^@(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d])(\/(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d]))?$/i
const tw = /^@\w{1,15}$/i

/**
 * Plugin to classify @mentions as source, which represents “external
 * (ungrammatical) values” instead of natural language.
 * This hides mentions from `retext-spell`, `retext-readability`,
 * `retext-equality`.
 *
 * @type {import('unified').Plugin<[Options?], Root>}
 */
export default function retextSyntaxMentions(options = {}) {
  const style = options.style || 'github'
  /** @type {RegExp} */
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
    visit(tree, 'SymbolNode', (node, index, parent_) => {
      const parent = /** @type {Sentence|Word} */ (parent_)

      if (toString(node) !== '@' || !parent || index === null) {
        return
      }

      const siblings = parent.children
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

      /** @type {Source} */
      const replacement = {
        type: 'SourceNode',
        value: toString(slice),
        position: {
          start: pointStart(node),
          end: pointEnd(slice[slice.length - 1])
        }
      }

      siblings.splice(index, offset - index, replacement)
    })
  }

  /**
   * @param {Array<SentenceContent>|Array<WordContent>} nodes
   * @returns {boolean}
   */
  function check(nodes) {
    return styleRe.test(toString(nodes).replace(genitive, ''))
  }
}
