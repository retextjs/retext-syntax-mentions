# retext-syntax-mentions [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Classify [**@mentions**](https://github.com/blog/821) as
[syntax][source], not natural language, in [**retext**][retext].

## Installation

[npm][]:

```bash
npm install retext-syntax-mentions
```

## Usage

Without `syntax-mentions`:

```javascript
var dictionary = require('dictionary-en-gb');
var unified = require('unified');
var english = require('retext-english');
var stringify = require('retext-stringify');
var spell = require('retext-spell');
var mentions = require('retext-syntax-mentions');
var report = require('vfile-reporter');

unified()
  .use(english)
  .use(spell, dictionary)
  .use(stringify)
  .process('Misspelt? @wooorm.', function (err, file) {
    console.log(report(err || file));
  });
```

Yields:

```text
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

```text
no issues found
```

## API

### `retext().use(mentions)`

Classify [**@mentions**](https://github.com/blog/821) as
[SourceNode][source]s, which represent “external (ungrammatical) values”
instead of natural language.  This hides mentions from [`retext-spell`][spell],
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

See [`contributing.md` in `retextjs/retext`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/retextjs/retext-syntax-mentions.svg

[travis]: https://travis-ci.org/retextjs/retext-syntax-mentions

[codecov-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-syntax-mentions.svg

[codecov]: https://codecov.io/github/retextjs/retext-syntax-mentions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[source]: https://github.com/syntax-tree/nlcst#source

[spell]: https://github.com/retextjs/retext-spell

[readability]: https://github.com/retextjs/retext-readability

[equality]: https://github.com/retextjs/retext-equality

[syntax-urls]: https://github.com/retextjs/retext-syntax-urls

[contributing]: https://github.com/retextjs/retext/blob/master/contributing.md

[coc]: https://github.com/retextjs/retext/blob/master/code-of-conduct.md
