var CacheManager = function CacheManager(options, storageSpace, garbageCollector, objectSerializer, setSerializer) {
  this.options          = options;
  this.name             = options.name;
  this._debug           = options.debug;

  this.storageSpace     = storageSpace;
  this.collector        = garbageCollector;
  this.objectSerializer = objectSerializer;
  this.setSerializer    = setSerializer;

  this.collectionQueue  = [];

};

CacheManager.prototype.debug = function _debug(msg){
  if (this._debug) {
    console.log(msg)
  }
};

// when items are added, both sets and individual objects, get the count and time, add it
// to the meta data object
CacheManager.prototype.setObject = function setObject(key, value, namespace) {
  var data;

  //TODO wrap in a try/catch block that will call .cleanup() in case of err

  //if @namespace param isn't present, exit early
  data = this._prepareObjectForCache(key, value, namespace);

  // if there is space in the local cache, keep retrying
  //if (!storageSpace) {
    this._retryCachingObject(data, namespace);
  //}
};

CacheManager.prototype._prepareObjectForCache = function _prepareObjectForCache(key, value, namespace) {
  var newValue,
    objSerializer = this.objectSerializer,
    objToSet = {},
    cachedObj = {};

  // serialize() the object through JSON before adding to cache
  // all values must be JSON-stringified before being added to the cache
  newValue = objSerializer.serialize(value);
  // object to set in the cache
  objToSet[key] = newValue;
  // cached collection object that gets added to the queue
  cachedObj[namespace] = key;

  return {
    objectToSet: objToSet,
    objectCacheReference: cachedObj
  }

};

CacheManager.prototype._retryCachingObject = function _retryCachingObject(metaData, namespace) {
  var hasNameSpace, nameSpacedData, cachedObj, objToSet,
    collection = this.collectionQueue,
    collector = this.collector,
    storageSpace = this.storageSpace;

  objToSet = metaData.objectToSet;
  cachedObj = metaData.objectCacheReference;

  try {
    hasNameSpace = storageSpace.getItem(namespace);
    //if namespaced array doesn't exist within the object
    if (!hasNameSpace) {
      //create a key in the storage space with the name of the namespace and the value of an array
      storageSpace.setItem(namespace, []);
      nameSpacedData = storageSpace.getItem(namespace);
      // push object in the namespace array in the cache
      nameSpacedData.push(objToSet);
      // Push the data into the collection after it is added to the local cache object --> maintains order
      collection.push(cachedObj);
      // if storageSpace does have the namespace
    } else {
      nameSpacedData = storageSpace.getItem(namespace);
      nameSpacedData.push(objToSet);
      // Push the data into the collection only after it is added to the local cache object --> maintains order
      collection.push(cachedObj);
    }
  }

  catch (err) {
    this.debug(' Err found. 5 MB Limit of cache reached. ');
    collector.cleanup(storageSpace, collection);

    this._retryCachingObject(metaData, namespace)
  }

};

CacheManager.prototype.setCategoricalSets = function setCategoricalSets(key, setsToSet, namespace) {
  var meta, setsOnSets,
      sets = [],
      setsMetaData = [],
      setSerializer = this.setSerializer,
      chunkSize = 3;

  // split setsToSet into chunks so that we can normalize each incoming set to a standard size
  if (setsToSet.length >= chunkSize) {
    setsOnSets = this._splitSetsToChunks(setsToSet, chunkSize);
  } else {
    //setsOnSets must be a nested array, even if it doesn't need to be split into chunks
    setsOnSets = sets.push(setsToSet);
  }
  // for each array of sets (each set length is chunkSize)
  setsOnSets.forEach(function(sets, index){
    // serialize the set and return the meta object from SetSerializer()
    meta = setSerializer.serialize(sets);
    meta.setAddedCounter = index;
    // setsMetaData is the array we use with which to set each of the objects --> setObject()
    setsMetaData.push(meta);
    return setsMetaData;
  });

  // if there is space in the local cache, keep retrying
  //if (!storageSpace) {
    this._retryCachingCategoricalSets(setsMetaData, key, namespace); //wrap in a conditional to meet basecase
  //}
};

CacheManager.prototype._splitSetsToChunks = function _splitSetsToChunks(setsToSet, chunkSize) {
  var results = [];
  while (setsToSet.length) {
    results.push(setsToSet.splice(0, chunkSize));
  }
  return results;
};

// remove one item from the collection
// try to setObject() of the elements
// if fail again remove another item from the collection
// try to setObject() of the elements
// keep trying until
//      (1) elements successfully added
//      (2) no items are left to remove from the cache
CacheManager.prototype._retryCachingCategoricalSets = function _retryCachingCategoricalSets(setsMetaData, key, namespace){
  var newKey, newValue,
      storageSpace = this.storageSpace,
      collection = this.collectionQueue,
      collector = this.collector,
      _this = this;

  try {
    setsMetaData.forEach(function (set, index) {
      newKey = key + '-id-' + index;
      newValue = set.serializedData;
      _this.setObject(newKey, newValue, namespace);
    });
  }

  catch (err) {
    this.debug(' Err found. 5 MB Limit of cache reached. ');
    collector.cleanup(storageSpace, collection);

    this._retryCachingCategoricalSets(setsMetaData, key, namespace);
  }

};


CacheManager.prototype.getObject = function getObject(key, namespace) {
  var objToDeserialize, cachedItemsNamespaced, el,
      deserializedObj,
      storage = this.storageSpace.localStorage,
      objSerializer = this.objectSerializer;

  //throw error if key is not a string
  if ((key && namespace)  === typeof String) {
    throw ('Error. Key and namespace are not strings')
  }

  cachedItemsNamespaced = storage[namespace];
  cachedItemsNamespaced.forEach(function(nameSpacedItem){
    for (el in nameSpacedItem) {
      if (el == key) {
        objToDeserialize = nameSpacedItem
      }
    }
  });

  //TODO: get Brandon's help w/ deserialization of objects. Need JSON.parse?
  deserializedObj = objSerializer.deserialize(objToDeserialize);


  return deserializedObj;
};

CacheManager.prototype.getCategoricalSets = function getCategoricalSets(key, namespace) {
  var setsToDeserialize,
      deserializedSet,
      setSerializer = this.setSerializer;


  //JSON.parse[s the (TamperObj)]
  setsToDeserialize = this.getObject(key, namespace);

  deserializedSet = setSerializer.deserialize(setsToDeserialize);

  return deserializedSet
};

module.exports = CacheManager;