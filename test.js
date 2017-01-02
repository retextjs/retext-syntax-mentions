'use strict';

var test = require('tape');
var retext = require('retext');
var u = require('unist-builder');
var mentions = require('./');

var processor = retext().use(mentions);

test('mentions()', function (t) {
  t.deepEqual(
    processor.run(processor.parse('This @wooorm and @foo/bar.')),
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
  );

  t.deepEqual(
    processor.run(processor.parse('One letter: @t & too long: @0123456789012345678901234567890123456789, @perfect.', {position: false})),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'One')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'letter')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', pos(null, null, null, null, null, null), '@t'),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', '&'),
          u('WhiteSpaceNode', ' '),

          u('WordNode', [u('TextNode', 'too')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'long')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', '@'),
          u('WordNode', [u('TextNode', '0123456789012345678901234567890123456789')]),
          u('PunctuationNode', ','),
          u('WhiteSpaceNode', ' '),

          u('SourceNode', pos(null, null, null, null, null, null), '@perfect'),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    'should work without position'
  );

  t.deepEqual(
    processor.run(processor.parse('One dash: @foo-bar & multiple dashes: @alpha-bravo/charlie-delta.', {position: false})),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'One')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'dash')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', pos(null, null, null, null, null, null), '@foo-bar'),
          u('WhiteSpaceNode', ' '),
          u('SymbolNode', '&'),
          u('WhiteSpaceNode', ' '),

          u('WordNode', [u('TextNode', 'multiple')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'dashes')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', pos(null, null, null, null, null, null), '@alpha-bravo/charlie-delta'),
          u('PunctuationNode', '.')
        ])
      ])
    ]),
    'should work with dashes'
  );

  t.deepEqual(
    processor.run(processor.parse('Final @', {position: false})),
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
  );

  t.deepEqual(
    processor.run(processor.parse('Not misspelt: @wooorm', {position: false})),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'Not')]),
          u('WhiteSpaceNode', ' '),
          u('WordNode', [u('TextNode', 'misspelt')]),
          u('PunctuationNode', ':'),
          u('WhiteSpaceNode', ' '),
          u('SourceNode', pos(null, null, null, null, null, null), '@wooorm')
        ])
      ])
    ]),
    'should work as last item in sentence'
  );

  t.deepEqual(
    processor.run(processor.parse('Misspelt? @wooorm', {position: false})),
    u('RootNode', [
      u('ParagraphNode', [
        u('SentenceNode', [
          u('WordNode', [u('TextNode', 'Misspelt')]),
          u('PunctuationNode', '?')
        ]),
        u('WhiteSpaceNode', ' '),
        u('SentenceNode', [
          u('SourceNode', pos(null, null, null, null, null, null), '@wooorm')
        ])
      ])
    ]),
    'should work as only item in sentence'
  );

  t.end();
});

/* eslint-disable max-params */
function pos(l1, c1, o1, l2, c2, o2) {
  return {
    position: {
      start: {line: l1, column: c1, offset: o1},
      end: {line: l2, column: c2, offset: o2}
    }
  };
}
