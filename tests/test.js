var GarbageCollector = require('../lib/GarbageCollector'),
    ObjectSerializer = require('../lib/ObjectSerializer'),
    SetSerializer = require('../lib/SetSerializer'),
    Cache = require('../lib/CacheManager'),
    Tamp = require('tamp');


var opts = {name: 'localManager', debug: true};

var localStorageObj = {};
    localStorageObj.localStorage = {};

localStorageObj.setItem = function(key, value) {
  localStorageObj[key] = value;
};

var g = new GarbageCollector();
var objS = new ObjectSerializer();
var setS = new SetSerializer(Tamp);


var c = new Cache(opts, localStorageObj, g, objS, setS);


//set an object in the cache
c.setObject('hello', 'good');

//set categorical sets in the cache
c.setCategoricalSets('hello', [1,2,3,4,54,6]);
c.setCategoricalSets('hello', ['1', '2', '3', '4', '54', '6']);

console.log(c);



