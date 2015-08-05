var GarbageCollector = require('./lib/GarbageCollector'),
    LocalStorage = require('./tests/mock-local-storage/LocalStorage'),

    ObjectSerializer = require('./lib/ObjectSerializer'),
    SetSerializer = require('./lib/SetSerializer'),

    Encoder = require('tamp'),
    Decoder = require('./third-party/TamperDecoder'),

    Cache = require('./lib/CacheManager');

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
var c = new Cache(storage, g, objS, setS, opts);

/*
* setObject()
*
* */
c.setObject('example-key',
            {1: 'value-1',
             2: 'value-2',
             3: 'value-3'},
            'namespace-1')



