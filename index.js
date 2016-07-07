var util = require('util');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var glob = require('glob');
var mkdirp = require('mkdirp');

function RevWorldPlugin(patterns, options) {
  this.patterns = util.isArray(patterns) ? patterns : [patterns];
  this.options = Object.assign({}, options, {
    format: '[name]-[hash][ext]',
    algorithm: 'sha256',
    length: 8
  });
}

RevWorldPlugin.prototype.apply = function(compiler) {
  var self = this;
  var options = this.options;

  compiler.plugin('emit', function(compilation, callback) {
    var sourceMap = {};

    self.patterns.forEach(function(pattern) {
      var cwd = pattern.cwd ? (path.isAbsolute(pattern.cwd) ? pattern.cwd : path.resolve(process.cwd(), pattern.cwd)) : process.cwd();
      var src = pattern.src;
      var dest = path.isAbsolute(pattern.dest) ? pattern.dest : path.resolve(process.cwd(), pattern.dest);
      glob.sync(src, { cwd: cwd, nodir: true }).forEach(function(item) {
        var file = path.join(cwd, item);
        var createHash = crypto.createHash(self.options.algorithm);
        var fileData = fs.readFileSync(file);
        var hash = createHash.update(fileData).digest('hex');
        var suffix = hash.slice(0, self.options.length);
        var ext = path.extname(file);
        var newName = self.options.format
          .replace('[name]', path.basename(file, ext))
          .replace('[hash]', suffix)
          .replace('[ext]', ext);
        var destDir = path.join(dest, path.dirname(item))
        var destFile = path.join(destDir, newName);
        if (!fs.existsSync(destDir)) {
          mkdirp.sync(destDir);
        }
        fs.writeFileSync(destFile, fileData);
        var value = path.join(path.dirname(item), newName);
        sourceMap[item] = value;
        console.log(`${item} ====> ${value}`);
      });

    });
    // 将sourcemap绑定在compiler对象上传递给replace-hash-webpack-plugin使用
    compiler.revSourceMap = sourceMap;
    callback();
  });
};

module.exports = RevWorldPlugin;
