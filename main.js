requirejs.config({
  baseUrl: './',
  paths: {
    TamperDecoder: "./public/TamperDecoder",
    CacheManager: "./lib/CacheManager",
    AbstractSerializer: './lib/AbstractSerializer',
    SetSerializer: './lib/SetSerializer',
    GarbageCollector: './lib/GarbageCollector',
    ObjectSerializer: './lib/ObjectSerializer',
    underscore: './node_modules/underscore/underscore'
  },
  nodeRequire: require
});

console.log('hi')

require(['require', 'CacheManager'], function(require) {
  var CacheMan = require('CacheManager');

  if (CacheMan) {
    console.log('Cacheman loaded ');
    window.CacheMan = new CacheMan(localStorage);
  }


});
