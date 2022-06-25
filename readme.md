# retext-syntax-mentions

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[retext][]** plugin to classify `@mentions` as syntax instead of natural
language.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(retextSyntaxMentions[, options])`](#unifieduseretextsyntaxmentions-options)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([retext][]) plugin to classify mentions (as used
on for example [GitHub][mention]) as [`SourceNode`][source] instead of natural
language.
That node represent “external (ungrammatical) values” instead of natural
language, which hides mentions from [`retext-spell`][retext-spell],
[`retext-readability`][retext-readability],
[`retext-equality`][retext-equality], and other things that check words.

## When should I use this?

You can use this plugin any time there are mentions in prose, that are
(incorrectly) warned about by linting plugins.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, or 18.0+), install with [npm][]:

```sh
npm install retext-syntax-mentions
```

In Deno with [`esm.sh`][esmsh]:

```js
import retextSyntaxMentions from 'https://esm.sh/retext-syntax-mentions@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import retextSyntaxMentions from 'https://esm.sh/retext-syntax-mentions@3?bundle'
</script>
```

## Use

Without `retext-syntax-mentions`:

```js
import dictionary from 'dictionary-en-gb'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import retextEnglish from 'retext-english'
import retextSyntaxMentions from 'retext-syntax-mentions'
import retextSpell from 'retext-spell'
import retextStringify from 'retext-stringify'

const file = await unified()
  .use(retextEnglish)
  .use(retextSpell, dictionary)
  .use(retextStringify)
  .process('Misspelt? @wooorm.')

console.log(reporter(file))
```

Yields:

```txt
  1:12-1:18  warning  `wooorm` is misspelt; did you mean `worm`?  retext-spell  retext-spell

⚠ 1 warning
```

With `retext-syntax-mentions`:

```diff
   .use(retextEnglish)
+  .use(retextSyntaxMentions)
   .use(retextSpell, dictionary)
```

Yields:

```txt
no issues found
```

## API

This package exports no identifiers.
The default export is `retextSyntaxMentions`.

### `unified().use(retextSyntaxMentions[, options])`

Classify `@mentions` as syntax instead of natural language.

##### `options`

Configuration (optional).

###### `options.style`

Style can be either `'github'` (for GitHub user and team mentions), `'twitter'`
(for Twitter handles), or a regular expression (such as `/^@\w{1,15}$/i`, which
is the Twitter regex).

## Types

This package is fully typed with [TypeScript][].
It exports the additional type `Options`.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Related

*   [`retext-syntax-urls`][retext-syntax-urls]
    — classify URLs and filepaths as syntax
*   [`retext-spell`][retext-spell]
    — check spelling
*   [`retext-readability`][retext-readability]
    — check readability
*   [`retext-equality`][retext-equality]
    — check possible insensitive, inconsiderate language

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

[build-badge]: https://github.com/retextjs/retext-syntax-mentions/workflows/main/badge.svg

[build]: https://github.com/retextjs/retext-syntax-mentions/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-syntax-mentions.svg

[coverage]: https://codecov.io/github/retextjs/retext-syntax-mentions

[downloads-badge]: https://img.shields.io/npm/dm/retext-syntax-mentions.svg

[downloads]: https://www.npmjs.com/package/retext-syntax-mentions

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-syntax-mentions.svg

[size]: https://bundlephobia.com/result?p=retext-syntax-mentions

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/main/contributing.md

[support]: https://github.com/retextjs/.github/blob/main/support.md

[coc]: https://github.com/retextjs/.github/blob/main/code-of-conduct.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[retext]: https://github.com/retextjs/retext

[source]: https://github.com/syntax-tree/nlcst#source

[retext-spell]: https://github.com/retextjs/retext-spell

[retext-readability]: https://github.com/retextjs/retext-readability

[retext-equality]: https://github.com/retextjs/retext-equality

[retext-syntax-urls]: https://github.com/retextjs/retext-syntax-urls

[mention]: https://github.com/blog/821
