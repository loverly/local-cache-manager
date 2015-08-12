var GarbageCollector = require('../lib/GarbageCollector'),
    LocalStorage = require('../tests/mock-local-storage/LocalStorage'),

    ObjectSerializer = require('../lib/ObjectSerializer'),
    SetSerializer = require('../lib/SetSerializer'),

    Encoder = require('tamp'),
    Decoder = require('../public/TamperDecoder'),

    Cache = require('../lib/CacheManager');

// instantiates all object classes being used
// abstract classes are not instantiated and are extended
// this implements the Builder pattern to build all objects needed
var g = new GarbageCollector(),
    localStorage = new LocalStorage,
    objS = new ObjectSerializer(),
    setS = new SetSerializer(Encoder, Decoder),

    storage = localStorage.localStorage;

//set up CacheManager() options
var opts = {debug: true};

//console.log(localStorage.localStorage)

// instantiates a new CacheManager()
var c = new Cache(localStorage, g, objS, setS, opts);

/*
*  setObject(key, values, namespace)
*
* */
c.setObject(
  'example-key-1',
  {
    1: 'value-1',
    2: 'value-2',
    3: 'value-3'
  },
  'namespace-1'
);

c.setObject(
  'example-key-2',
  {
    4: 'value-1',
    5: 'value-2',
    6: 'value-3'
  },
  'namespace-2'
);

c.setObject(
  'example-key-3',
  {
    7: 'value-1',
    8: 'value-2',
    9: 'value-3'
  },
  'namespace-2'
);

/*
*  getObject(key, namespace)
*
* */
var obj = c.getObject('example-key-3', 'namespace-2');
console.log('getObject()  -->, ', obj);

// generate a categorical set of articles
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

var article2 = {
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

for (var i = 0; i < 13; i++) {
  itemsToSet.push(article1);
  itemsToSet.push(article2);
}

/*
 *  setCategoricalSets(key, itemsToSet, namespace)
 *
 * */
c.setCategoricalSets('key-set', itemsToSet, 'items-to-set');

/*
*  getCategoricalSets(key, namespace)
*
* */
var set = c.getCategoricalSets('key-set-id-1', 'items-to-set');
console.log('getCategoricalSets()  -->', set);

console.log('Cached Storage Unit', storage)


