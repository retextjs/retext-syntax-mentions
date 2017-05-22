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

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-syntax-mentions.svg

[travis]: https://travis-ci.org/wooorm/retext-syntax-mentions

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-syntax-mentions.svg

[codecov]: https://codecov.io/github/wooorm/retext-syntax-mentions

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[source]: https://github.com/wooorm/nlcst#source

[spell]: https://github.com/wooorm/retext-spell

[readability]: https://github.com/wooorm/retext-readability

[equality]: https://github.com/wooorm/retext-equality
