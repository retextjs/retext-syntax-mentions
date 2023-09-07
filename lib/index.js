/**
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('nlcst').RootContent} RootContent
 * @typedef {import('nlcst').Source} Source
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {RegExp | 'github' | 'twitter' | null | undefined} [style='github']
 *   Style of mentions (default: `'github'`); can be either `'github'` (for
 *   GitHub user and team mentions), `'twitter'` (for Twitter handles), or a
 *   regular expression (such as `/^@\w{1,15}$/i`, which is the Twitter regex).
 */

import {toString} from 'nlcst-to-string'
import {pointEnd, pointStart} from 'unist-util-position'
import {visit} from 'unist-util-visit'

/** @type {Readonly<Options>} */
const emptyOptions = {}

const genitive = /['’]s?$/i

const gh =
  /^@(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d])(\/(?:[a-z\d]{1,2}|[a-z\d][a-z\d-]{1,37}[a-z\d]))?$/i
const tw = /^@\w{1,15}$/i

/**
 * Classify `@mentions` as source (external ungrammatical values) instead of
 * natural language.
 *
 * This hides mentions from `retext-spell`, `retext-readability`,
 * `retext-equality`.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function retextSyntaxMentions(options) {
  const settings = options || emptyOptions
  const style = settings.style
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
      'Expected known style (`github`, `twitter`) or regex, not `' + style + '`'
    )
  }

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'SymbolNode', function (node, index, parent) {
      if (toString(node) !== '@' || !parent || index === undefined) {
        return
      }

      const siblings = parent.children
      let offset = index + 1

      while (offset < siblings.length) {
        const sibling = siblings[offset]

        if (sibling.type === 'WhiteSpaceNode') break

        if (
          toString(sibling) !== '/' &&
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

      const start = pointStart(node)
      const end = pointEnd(slice[slice.length - 1])
      const position = start && end ? {start, end} : undefined

      /** @type {Source} */
      const replacement = {type: 'SourceNode', value: toString(slice)}

      if (position) replacement.position = position

      siblings.splice(index, offset - index, replacement)
    })
  }

  /**
   * @param {Array<RootContent>} nodes
   *   Nodes.
   * @returns {boolean}
   *   Whether `nodes` is a mention.
   */
  function check(nodes) {
    return styleRe.test(toString(nodes).replace(genitive, ''))
  }
}
