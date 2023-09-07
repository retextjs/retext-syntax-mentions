import assert from 'node:assert/strict'
import test from 'node:test'
import {ParseEnglish} from 'parse-english'
import {unified} from 'unified'
import {u} from 'unist-builder'
import {removePosition} from 'unist-util-remove-position'
import retextSyntaxMentions from './index.js'

test('retext-syntax-mentions', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'default'
    ])
  })

  await t.test(
    'should throw when an incorrect style name is passed',
    async function () {
      assert.throws(function () {
        // @ts-expect-error: check how the runtime handles incorrect `style`.
        unified().use(retextSyntaxMentions, {style: '!'}).freeze()
      }, /Expected known style/)
    }
  )

  await t.test('should work', async function () {
    const tree = new ParseEnglish().parse('This @wooorm and @foo/bar.')
    await unified().use(retextSyntaxMentions).run(tree)

    assert.deepEqual(
      tree,
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
      ])
    )
  })

  await t.test('should be case-insensitive', async function () {
    const tree = new ParseEnglish().parse('This @MikeMcQuaid that.')
    await unified().use(retextSyntaxMentions).run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
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
      ])
    )
  })

  await t.test('should support possessive apos+s (`’s`)', async function () {
    const tree = new ParseEnglish().parse('This @wooorm’s that.')
    await unified().use(retextSyntaxMentions).run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
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
      ])
    )
  })

  await t.test("should support possessive quote+s (`'s`)", async function () {
    const tree = new ParseEnglish().parse("This @wooorm's that.")
    await unified().use(retextSyntaxMentions).run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
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
      ])
    )
  })

  await t.test('should work without position', async function () {
    const tree = new ParseEnglish().parse(
      'One letter: @t & too long: @0123456789012345678901234567890123456789, @perfect.'
    )

    removePosition(tree, {force: true})

    await unified().use(retextSyntaxMentions).run(tree)

    assert.deepEqual(
      tree,
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
      ])
    )
  })

  await t.test('should work with dashes', async function () {
    const tree = new ParseEnglish().parse(
      'One dash: @foo-bar & multiple dashes: @alpha-bravo/charlie-delta.'
    )
    await unified().use(retextSyntaxMentions).run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
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
      ])
    )
  })

  await t.test('should work with a final `@`', async function () {
    const tree = new ParseEnglish().parse('Final @')
    await unified().use(retextSyntaxMentions).run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
      u('RootNode', [
        u('ParagraphNode', [
          u('SentenceNode', [
            u('WordNode', [u('TextNode', 'Final')]),
            u('WhiteSpaceNode', ' '),
            u('SymbolNode', '@')
          ])
        ])
      ])
    )
  })

  await t.test('should work as last item in sentence', async function () {
    const tree = new ParseEnglish().parse('Not misspelt: @wooorm')
    await unified().use(retextSyntaxMentions).run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
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
      ])
    )
  })

  await t.test('should work as only item in sentence', async function () {
    const tree = new ParseEnglish().parse('Misspelt? @wooorm')
    await unified().use(retextSyntaxMentions).run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
      u('RootNode', [
        u('ParagraphNode', [
          u('SentenceNode', [
            u('WordNode', [u('TextNode', 'Misspelt')]),
            u('PunctuationNode', '?')
          ]),
          u('WhiteSpaceNode', ' '),
          u('SentenceNode', [u('SourceNode', '@wooorm')])
        ])
      ])
    )
  })

  await t.test('should support twitter handles', async function () {
    const tree = new ParseEnglish().parse(
      '@_philippkuehn (my twitter handle) is not recognized.'
    )
    await unified().use(retextSyntaxMentions, {style: 'twitter'}).run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
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
      ])
    )
  })

  await t.test('should support custom handles', async function () {
    const tree = new ParseEnglish().parse('@lettersOnly, no @123123 digits.')
    await unified()
      .use(retextSyntaxMentions, {style: /^@[a-z]{1,15}$/i})
      .run(tree)

    removePosition(tree, {force: true})

    assert.deepEqual(
      tree,
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
      ])
    )
  })
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
