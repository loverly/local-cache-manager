var GarbageCollector = require('../lib/GarbageCollector'),
    ObjectSerializer = require('../lib/ObjectSerializer'),
    SetSerializer = require('../lib/SetSerializer'),
    Cache = require('../lib/CacheManager'),
    Encoder = require('tamp'),
    Decoder = require('../lib/TamperDecoder');

//set up local Storage options
var opts = {name: 'localManager', debug: true};

// mocks window.localStorage object
var localStorageObj = {};
    localStorageObj.localStorage = {};

// mocks localStorage public API setItem()
localStorageObj.setItem = function(key, value) {
  localStorageObj[key] = value;
};

// mocks localStorage public API getItem()_
localStorageObj.getItem = function(key) {
    //console.log(localStorageObj[key]);
  return localStorageObj[key];
};

// instantiates all object classes being used
// abstract classes are not instantiated and are extended
// this implements the Builder pattern to build all objects needed
var g = new GarbageCollector();
var objS = new ObjectSerializer();
var setS = new SetSerializer(Encoder, Decoder);

// instantiates a new cache
var c = new Cache(opts, localStorageObj, g, objS, setS);

/**************** Tests to Validate Use Cases ******************/
//set an object in the cache
c.setObject('key-obj', {1: 'a', 2: 'b', 3: 'c'});
//console.log('Cache', c)

//var b = c.getObject('key-obj');
//console.log('Cache, ', b);

var article1 = {
    _ObjectID: '559208d8a1e2c35fbe2709bd',
    id: 28714,
    published: '2015-04-24T21:05:41.000Z',
    modified: '2015-06-30T03:13:20.688Z',
    created: '2015-04-24T19:09:38.000Z',
    title: 'Wait, Is Lea Michele Making Cat Weddings a Real Thing?',
    desktop_cover_image: 'https://19fe8458de3b63a94f81-1ed88f26861922227a1edea35bb56ecc.ssl.cf2.rackcdn.com/thumbnails_390/86655_greatcatsby_1396311319_251.jpg',
    mobile_cover_image: 'https://19fe8458de3b63a94f81-1ed88f26861922227a1edea35bb56ecc.ssl.cf2.rackcdn.com/thumbnails_390/86655_greatcatsby_1396311319_251.jpg',
};
var article2= {
    _ObjectID: '485709245hffs',
    id: 38445,
    published: '2016-12-23T21:08:445.0Z',
    modified: '2015-03-20T04:10:10.6Z',
    created: '2014-07-281980:38.0Z',
    title: 'Who Done It?',
    desktop_cover_image: 'https://19fe8458de3b63a94f81-1ed88f26861922227a1edea35bb56ecc.ssl.cf2.rackcdn.com/thumbnails_390/new.jpg',
    mobile_cover_image: 'https://19fe8458de3b63a94f81-1ed88f26861922227a1edea35bb56ecc.ssl.cf2.rackcdn.com/thumbnails_390/new.jpg',
};

var itemsToSet = [];

//for (var i = 0; i < 1; i++) {
itemsToSet.push(article1);
itemsToSet.push(article2);
//}

//set categorical sets in the cache
c.setCategoricalSets('key-sets', itemsToSet, true);

// get an object in the cache
//var o = c.getObject('key-obj');
//console.log('getObject()--> returns', o)

 //get Categorical Sets in the cache
var ll  = c.getCategoricalSets('key-sets');
//console.log('Categorical sets, ', ll);

console.log('Cache', c);








