// Generated by CoffeeScript 1.6.2
var NgminUglifyMinifier, clone, ngmin, sysPath, uglify,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

sysPath = require('path');

uglify = require('uglify-js');

ngmin = require('ngmin');

clone = function(obj) {
  var copied, key, val;

  if ((obj == null) || typeof obj !== 'object') {
    return obj;
  }
  copied = new obj.constructor();
  for (key in obj) {
    val = obj[key];
    copied[key] = clone(val);
  }
  return copied;
};

module.exports = NgminUglifyMinifier = (function() {
  NgminUglifyMinifier.prototype.brunchPlugin = true;

  NgminUglifyMinifier.prototype.type = 'javascript';

  function NgminUglifyMinifier(config) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

    this.config = config;
    this.optimize = __bind(this.optimize, this);
    this.options = (clone((_ref = this.config) != null ? (_ref1 = _ref.plugins) != null ? _ref1.uglify : void 0 : void 0)) || {};
    this.filter = (_ref2 = this.config) != null ? (_ref3 = _ref2.plugins) != null ? (_ref4 = _ref3.ngmin) != null ? _ref4.filter : void 0 : void 0 : void 0;
    this.options.fromString = true;
    this.options.sourceMaps = (_ref5 = this.config) != null ? _ref5.sourceMaps : void 0;
  }

  NgminUglifyMinifier.prototype.optimize = function(data, path, callback) {
    var err, error, ngmined, optimized, options, result;

    options = this.options;
    options.outSourceMap = options.sourceMaps ? "" + path + ".map" : void 0;
    try {
      if (path.search(this.filter) === -1) {
        return callback(void 0, {
          data: data
        });
      } else {
        ngmined = ngmin.annotate(data);
        optimized = uglify.minify(ngmined, options);
        result = optimized && options.sourceMaps ? {
          data: optimized.code,
          map: optimized.map
        } : {
          data: optimized.code
        };
        return callback(void 0, result);
      }
    } catch (_error) {
      err = _error;
      error = "Ngmin or JS minify failed on " + path + ": " + err;
      return callback(error, {
        data: data
      });
    }
  };

  return NgminUglifyMinifier;

})();
