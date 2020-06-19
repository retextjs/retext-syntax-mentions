# retext-syntax-mentions

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**retext**][retext] plugin to classify
[**@mentions**](https://github.com/blog/821) as [syntax][source], not natural
language.

## Install

[npm][]:

```sh
npm install retext-syntax-mentions
```

## Use

Without `syntax-mentions`:

```js
var dictionary = require('dictionary-en-gb')
var unified = require('unified')
var english = require('retext-english')
var stringify = require('retext-stringify')
var spell = require('retext-spell')
var mentions = require('retext-syntax-mentions')
var report = require('vfile-reporter')

unified()
  .use(english)
  .use(spell, dictionary)
  .use(stringify)
  .process('Misspelt? @wooorm.', function(err, file) {
    console.log(report(err || file))
  })
```

Yields:

```txt
  1:12-1:18  warning  `wooorm` is misspelt; did you mean `worm`?  retext-spell  retext-spell

⚠ 1 warning
```

With `syntax-mentions`:

```diff
   .use(english)
+  .use(mentions)
   .use(spell, dictionary)
```

Yields:

```txt
no issues found
```

## API

### `retext().use(mentions[, options])`

Classify [**@mentions**](https://github.com/blog/821) as [**source**][source],
which represent “external (ungrammatical) values” instead of natural language.
This hides mentions from [`retext-spell`][spell],
[`retext-readability`][readability], [`retext-equality`][equality], and more.

###### `options.style`

Style can be either `'github'` (for GitHub user and team mentions), `'twitter'`
(for Twitter handles), or a regular expression (such as `/^@\w{1,15}$/i`, which
is the Twitter regex).

## Related

*   [`retext-syntax-urls`][syntax-urls]
    — Classify URLs and filepaths as syntax
*   [`retext-spell`][spell]
    — Check spelling
*   [`retext-readability`][readability]
    — Check readability
*   [`retext-equality`][equality]
    — Check possible insensitive, inconsiderate language

## Contribute

See [`contributing.md`][contributing] in [`retextjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/retextjs/retext-syntax-mentions.svg

[build]: https://travis-ci.org/retextjs/retext-syntax-mentions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-syntax-mentions.svg

[coverage]: https://codecov.io/github/retextjs/retext-syntax-mentions

[downloads-badge]: https://img.shields.io/npm/dm/retext-syntax-mentions.svg

[downloads]: https://www.npmjs.com/package/retext-syntax-mentions

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-syntax-mentions.svg

[size]: https://bundlephobia.com/result?p=retext-syntax-mentions

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/retext

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/retextjs/.github/blob/HEAD/support.md

[coc]: https://github.com/retextjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[source]: https://github.com/syntax-tree/nlcst#source

[spell]: https://github.com/retextjs/retext-spell

[readability]: https://github.com/retextjs/retext-readability

[equality]: https://github.com/retextjs/retext-equality

[syntax-urls]: https://github.com/retextjs/retext-syntax-urls
