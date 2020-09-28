# retext-syntax-mentions-channels

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**retext**][retext] plugin to classify
[**@mentions**](https://github.com/blog/821) as [syntax][source], not natural
language.  It also ignores chat channels like the ones used on Slack, for 
example `#this-is-a-channel`.

**DISCLAIMER**: This is a modified version of
[retext-syntax-mentions](https://github.com/retextjs/retext-syntax-mentions).
There are some links in the documentation that are still mentioning this project
as its original name.

## Install

[npm][]:

```sh
npm install retext-syntax-mentions-channels
```

## Use

Without `syntax-mentions-channels`:

```js
var dictionary = require('dictionary-en-gb')
var unified = require('unified')
var english = require('retext-english')
var stringify = require('retext-stringify')
var spell = require('retext-spell')
var mentions = require('retext-syntax-mentions-channels')
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

With `syntax-mentions-channels`:

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

### `retext().use(mentions)`

Classify [**@mentions**](https://github.com/blog/821) as [**source**][source],
which represent “external (ungrammatical) values” instead of natural language.
This hides mentions from [`retext-spell`][spell],
[`retext-readability`][readability], [`retext-equality`][equality], and more.

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

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
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

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/retext

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/master/contributing.md

[support]: https://github.com/retextjs/.github/blob/master/support.md

[coc]: https://github.com/retextjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[source]: https://github.com/syntax-tree/nlcst#source

[spell]: https://github.com/retextjs/retext-spell

[readability]: https://github.com/retextjs/retext-readability

[equality]: https://github.com/retextjs/retext-equality

[syntax-urls]: https://github.com/retextjs/retext-syntax-urls
