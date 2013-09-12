sysPath = require 'path'
uglify = require 'uglify-js'
ngmin = require 'ngmin'

clone = (obj) ->
  return obj if not obj? or typeof obj isnt 'object'
  copied = new obj.constructor()
  copied[key] = clone val for key, val of obj
  copied

module.exports = class NgminUglifyMinifier
  brunchPlugin: yes
  type: 'javascript'

  constructor: (@config) ->
    @options = (clone @config?.plugins?.uglify) or {}
    @options.fromString = yes
    @options.sourceMaps = @config?.sourceMaps

  optimize: (data, path, callback) =>
    options = @options
    options.outSourceMap = if options.sourceMaps
      "#{path}.map"
    else
      undefined
    try
      # TODO dirty hack
      if path.slice(-2) != "js"
        callback undefined, {data: data}
      else
        ngmined = ngmin.annotate(data)
        optimized = uglify.minify(ngmined, options)
        result = if optimized and options.sourceMaps
          data: optimized.code
          map: optimized.map
        else
          data: optimized.code
        callback undefined, result
    catch err
      error = "Ngmin or JS minify failed on #{path}: #{err}"
      callback error, {data: data}
