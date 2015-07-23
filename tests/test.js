var GarbageCollector = require('../lib/GarbageCollector'),
    ObjectSerializer = require('../lib/ObjectSerializer'),
    SetSerializer = require('../lib/SetSerializer'),
    Cache = require('../lib/CacheManager'),
    Tamp = require('tamp');

//set up local Storage options
var opts = {name: 'localManager', debug: true};

// mocks window.localStorage object
var localStorageObj = {};
    localStorageObj.localStorage = {};

// mocks localStorage public API setItem()
localStorageObj.setItem = function(key, value) {
  localStorageObj[key] = value;
};

// instantiates all object classes being used
// abstract classes are not instantiated and are extended
// this implements the Builder pattern to build all objects needed
var g = new GarbageCollector();
var objS = new ObjectSerializer();
var setS = new SetSerializer(Tamp);

// instantiates a new cache
var c = new Cache(opts, localStorageObj, g, objS, setS);


/**************** Tests to Validate Use Cases ******************/
//set an object in the cache
c.setObject('hello', 'good');

var article = {
    _ObjectID: '559208d8a1e2c35fbe2709bd',
    id: 28714,
    hash: '410Dd',
    published: '2015-04-24T21:05:41.000Z',
    modified: '2015-06-30T03:13:20.688Z',
    created: '2015-04-24T19:09:38.000Z',
    title: 'Wait, Is Lea Michele Making Cat Weddings a Real Thing?',
    slug: 'wait-is-lea-michele-making-cat-weddings-a-real-thing',
    excerpt: '',
    status: 'published',
    author: 'loverly',
    primary_category: 'Celebrity + Buzz',
    url_category: 'All',
    keywords: null,
    meta_title: 'Wait, Is Lea Michele Making Cat Weddings a Real Thing?',
    meta_description: 'Looks like someone iss getting married (and it is not Lea).',
    browse_more_link: null,
    browse_more_text: null,
    desktop_cover_image: 'https://19fe8458de3b63a94f81-1ed88f26861922227a1edea35bb56ecc.ssl.cf2.rackcdn.com/thumbnails_390/86655_greatcatsby_1396311319_251.jpg',
    mobile_cover_image: 'https://19fe8458de3b63a94f81-1ed88f26861922227a1edea35bb56ecc.ssl.cf2.rackcdn.com/thumbnails_390/86655_greatcatsby_1396311319_251.jpg',
    social_image: 'https://19fe8458de3b63a94f81-1ed88f26861922227a1edea35bb56ecc.ssl.cf2.rackcdn.com/thumbnails_390/86655_greatcatsby_1396311319_251.jpg',
    bundle_id: 94665,
    body: [
        {
            type: 'paragraph',
            inlineElements: [
                {
                    type: 'text',
                    text: ''
                },
                {
                    type: 'em',
                    text: 'maybe'
                },
                {
                    type: 'text',
                    text: 'it was a joke...) and now it looks like Lea might actually be taking cat nuptials mainstream.'
                }
            ]
        }
    ]
};

var itemsToSet = [];

for (var i = 0; i < 5; i++) {
    itemsToSet.push(article)
}

//console.log('Items to set', itemsToSet);

//set categorical sets in the cache
//c.setCategoricalSets('hello', [1,2,3,4,54,6]);
c.setCategoricalSets('hello', itemsToSet);



console.log('Cache-Man: ', c);



