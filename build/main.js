requirejs.config({
  baseUrl: 'scripts',
  paths: {
    // Underscore uses the named-module pattern and therefore cannot be required
    // by its path "third-party/underscore)
    underscore: 'third-party/underscore'
  }
});

requirejs(['require', 'underscore', './CacheManager'], function(require) {
  var CacheMan = require('CacheManager');

  var cache = new CacheMan(localStorage);

  var _ = require('underscore');
  console.log(_.pluck([{name: 'hello'}, {name: 'jello'}], 'name'));
});
