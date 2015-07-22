var garbageCollector = require('../lib/GarbageCollector'),
    objectSerializer = require('../lib/ObjectSerializer'),
    setSerializer = require('../lib/SetSerializer'),
    cache = require('../lib/CacheManager');


var opts = {name: 'localManager', debug: true};

var localStorageObj = {};
localStorageObj.localStorage = {};

localStorageObj.setItem = function(key, value) {
  localStorageObj[key] = value;
};

var g = new garbageCollector();
var objS = new objectSerializer();
var setS = new setSerializer();

var c = new cache(opts, localStorageObj, g, objS, setS);


c.setObject('hello', 'good');

console.log(c);



