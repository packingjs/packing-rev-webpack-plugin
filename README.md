## Packing Rev Webpack Plugin

This is a [webpack](http://webpack.github.io/) plugin that reversion files to the build directory.

### Getting started

Install the plugin:

```
npm install --save-dev packing-rev-webpack-plugin
```

### Usage

`new RevWebpackPlugin([patterns], options)`

new RevWebpackPlugin({
      cwd: path.join(cwd, assets),
      src: '**/*.{jpg,png}',
      dest: path.join(cwd, assetsDist),
    }),

A pattern looks like:
`{ cwd: '', src: '**/*', dest: 'dest' }`

#### Pattern properties:
* `src`
    - is required
    - can be a glob
* `dest`
    - is optional
    - if not absolute, it's relative to the build root
* `cwd`
    - is optional
    - The base directory (absolute path!) for reversion
    - defaults to process.cwd()
* `regexps`
    - is optional
    - regExp from template replace

#### Available options:
* `format`
    - is optional
    - reversion name format
    - default value is `[name]-[hash][ext]`
* `algorithm`
    - is optional
    - default value is `sha256`
* `length`
    - is optional
    - default value is `8`

### Examples

```javascript
var RevWebpackPlugin = require('packing-rev-webpack-plugin');
var path = require('path');

module.exports = {
    plugins: [
        new RevWebpackPlugin([
            { src: 'from/file.txt', dest: 'dist' },

            // {output}/to/file.txt
            { cwd: 'assets', src: 'images/**/*', dest: 'imgs' }
        ])
    ]
};
```
