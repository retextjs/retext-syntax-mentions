import test from 'tape'
import {retext} from 'retext'
import {u} from 'unist-builder'
import {removePosition} from 'unist-util-remove-position'
import retextSyntaxMentions from './index.js'

/** @type {import('unified').Plugin<[]>} */
const strip = () => (tree) => {
  removePosition(tree, true)
}

const position = retext().use(retextSyntaxMentions)
const noPosition = retext().use(retextSyntaxMentions).use(strip)

test('retext-syntax-mentions', (t) => {
  t.throws(
    () => {
      // @ts-expect-error: runtime.
      retext().use(retextSyntaxMentions, {style: '!'}).freeze()
    },
    /^Error: Expected known style/,
    'should throw when an incorrect style name is passed'
  )

  t.deepLooseEqual(
    position.runSync(position.parse('This @wooorm and @foo/bar.')),
    u('RootNode', pos(1, 1, 0, 1, 27, 26), [
      u('ParagraphNode', pos(1, 1, 0, 1, 27, 26), [
        u('SentenceNode', pos(1, 1, 0, 1, 27, 26), [
          u('WordNode', pos(1, 1, 0, 1, 5, 4), [
            u('TextNode', pos(1, 1, 0, 1, 5, 4), 'This')
          ]),
          u('WhiteSpaceNode', pos(1, 5, 4, 1, 6, 5), ' '),
          u('SourceNode', pos(1, 6, 5, 1, 13, 12), '@wooorm'),
          u('WhiteSpaceNode', pos(1, 13, 12, 1, 14, 13), ' '),
          u('WordNode', pos(1, 14, 13, 1, 17, 16), [
            u('TextNode', pos(1, 14, 13, 1, 17, 16), 'and')
          ]),
          u('WhiteSpaceNode', pos(1, 17, 16, 1, 18, 17), ' '),
          u('SourceNode', pos(1, 18, 17, 1, 26, 25), '@foo/bar'),
          u('PunctuationNode', pos(1, 26, 25, 1, 27, 26), '.')
        ])
      ])
    ]),
    'should work'
  )

  t.deepEqual(
    noPosition.runSync(noPosition.parse('This @MikeMcQuaid that.')),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'This')]),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', '@MikeMcQuaid'),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'that')]),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    'should be case-insensitive'
  )

  t.deepEqual(
    noPosition.runSync(noPosition.parse('This @wooorm’s that.')),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'This')]),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', '@wooorm’s'),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'that')]),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    'should support possessive apos+s (`’s`)'
  )

  t.deepEqual(
    noPosition.runSync(noPosition.parse("This @wooorm's that.")),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'This')]),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', "@wooorm's"),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'that')]),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    "should support possessive quote+s (`'s`)"
  )

  t.deepEqual(
    noPosition.runSync(
      noPosition.parse(
        'One letter: @t & too long: @0123456789012345678901234567890123456789, @perfect.'
      )
    ),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'One')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'letter')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', '@t'),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', '&'),
          u('WhiteSpaceNode', ' '),

          u('WordNode', [u('TextNode', 'too')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'long')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', '@'),
          u('WordNode', [
            u('TextNode', '0123456789012345678901234567890123456789')
          ]),
          u('PunctuationNode', ','),
          u('WhiteSpaceNode', ' '),

          u('SourceNode', '@perfect'),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    'should work without position'
  )

  t.deepEqual(
    noPosition.runSync(
      noPosition.parse(
        'One dash: @foo-bar & multiple dashes: @alpha-bravo/charlie-delta.'
      )
    ),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'One')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'dash')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', '@foo-bar'),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', '&'),
          u('WhiteSpaceNode', ' '),

          u('WordNode', [u('TextNode', 'multiple')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'dashes')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', '@alpha-bravo/charlie-delta'),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    'should work with dashes'
  )

  t.deepEqual(
    noPosition.runSync(noPosition.parse('Final @')),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'Final')]),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', '@')
        ])
      ])
    ]),
    'should work with a final `@`'
  )

  t.deepEqual(
    noPosition.runSync(noPosition.parse('Not misspelt: @wooorm')),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'Not')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'misspelt')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', '@wooorm')
        ])
      ])
    ]),
    'should work as last item in sentence'
  )

  t.deepEqual(
    noPosition.runSync(noPosition.parse('Misspelt? @wooorm')),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'Misspelt')]),
          u('PunctuationNode', '?')
        ]),
        u('WhiteSpaceNode', ' '),
        u('SentenceNode', [u('SourceNode', '@wooorm')])
      ])
    ]),
    'should work as only item in sentence'
  )

  t.deepEqual(
    retext()
      .use(retextSyntaxMentions, {style: 'twitter'})
      .use(strip)
      .runSync(
        noPosition.parse(
          '@_philippkuehn (my twitter handle) is not recognized.'
        )
      ),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('SourceNode', '@_philippkuehn'),
          u('WhiteSpaceNode', ' '),
          u('PunctuationNode', '('),
          u('WordNode', [u('TextNode', 'my')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'twitter')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'handle')]),
          u('PunctuationNode', ')'),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'is')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'not')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'recognized')]),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    'should support twitter handles'
  )

  t.deepEqual(
    retext()
      .use(retextSyntaxMentions, {style: /^@[a-z]{1,15}$/i})
      .use(strip)
      .runSync(noPosition.parse('@lettersOnly, no @123123 digits.')),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('SourceNode', '@lettersOnly'),
          u('PunctuationNode', ','),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'no')]),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', '@'),
          u('WordNode', [u('TextNode', '123123')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'digits')]),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    'should support custom handles'
  )

  t.end()
})

/**
 * @param {number} l1
 * @param {number} c1
 * @param {number} o1
 * @param {number} l2
 * @param {number} c2
 * @param {number} o2
 */
// eslint-disable-next-line max-params
function pos(l1, c1, o1, l2, c2, o2) {
  return {
    position: {
      start: {line: l1, column: c1, offset: o1},
      end: {line: l2, column: c2, offset: o2}
    }
  }
}
