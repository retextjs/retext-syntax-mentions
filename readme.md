# retext-syntax-mentions [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Classify [**@mentions**](https://github.com/blog/821) as
[syntax][source], not natural language, in [**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-syntax-mentions
```

## Usage

```javascript
var dictionary = require('dictionary-en-gb');
var retext = require('retext');
var english = require('retext-english');
var spell = require('retext-spell');
var mentions = require('retext-syntax-mentions');
var report = require('vfile-reporter');
```

Without `syntax-mentions`:

```js
retext().use(english).use(spell, dictionary).process([
  'Misspelt? @wooorm.'
].join('\n'), function (err, file) {
  console.log(report(err || file));
});
```

Yields:

```text
  1:12-1:18  warning  wooorm is misspelled        spelling

⚠ 1 warning
```

With `syntax-mentions`:

```diff
-retext().use(english).use(spell, dictionary).process([
+retext().use(english).use(mentions).use(spell, dictionary).process([
   'Misspelt? @wooorm.'
```

Yields:

```text
no issues found
```

## API

### `retext().use(mentions)`

Classify [**@mentions**](https://github.com/blog/821) as
[SourceNode][source]s, which represent “external (ungrammatical) values”
instead of natural language.  This hides mentions from [retext-spell][],
[retext-readability][], [retext-equality][], and more.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-syntax-mentions.svg

[travis]: https://travis-ci.org/wooorm/retext-syntax-mentions

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-syntax-mentions.svg

[codecov]: https://codecov.io/github/wooorm/retext-syntax-mentions

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[source]: https://github.com/wooorm/nlcst#source

[retext-spell]: https://github.com/wooorm/retext-spell

[retext-readability]: https://github.com/wooorm/retext-readability

[retext-equality]: https://github.com/wooorm/retext-equality
