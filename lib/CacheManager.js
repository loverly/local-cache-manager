/*
*   CacheManager() is responsible for implementing the public API methods of cache-man.
*
*   These public API methods are aimed at providing an easy to use way of serializing
*   and deserializing data that is cached in the window, either sessionStorage or
*   localStorage.
*
*
* */
var CacheManager = function CacheManager(storageSpace, garbageCollector, objectSerializer, setSerializer, options) {
  this.storageSpace     = storageSpace;
  this.collector        = garbageCollector;
  this.objectSerializer = objectSerializer;
  this.setSerializer    = setSerializer;

  this.options = options;
  this.name = options.name;
  this._debug = options.debug;

  this.collectionQueue  = [];
};

CacheManager.prototype.debug = function _debug(msg){
  if (this._debug) {
    console.log(msg)
  }
};
/*
*  @key        String
*  @value      String or Object
*  @namespace  String
*
*  Public API Method -- Setter for Individual Entities
*
*  setObject() is responsible for setting a value, with its key, in the proper namespace
*  of the cache. setObject() calls two private methods, _prepareObjectForCache() which serializes
*  the value through JSON protocol for caching, and _retryCachingObject() which recursively
*  tries to add the object to the cache.
*
*
* */
CacheManager.prototype.setObject = function setObject(key, value, namespace) {
  var data;

  //throw error if key is not a string
  if ((key && namespace) === typeof String) {
    throw ('Error. Key and namespace are not strings')
  }

  //if @namespace param isn't present, exit early
  data = this._prepareObjectForCache(key, value, namespace);

  // if there is space in the local cache, keep retrying
  this._retryCachingObject(data, namespace);
};

/*
*  @key        String
*  @value      String or Object
*  @namespace  String
*
*  Private API Method
*
*  _prepareObjectForCache() is responsible for serializing the value through JSON protocol, in
*  preparation for caching. The method returns the actual key-value pair object to set, as well
*  as a reference to the item in the cache through a key-value pair of the namespace and the unique
*  key of the the item to be cached.
*
* */
CacheManager.prototype._prepareObjectForCache = function _prepareObjectForCache(key, value, namespace) {
  var newValue,
    objSerializer = this.objectSerializer,
    objToSet = {},
    cachedObj = {};

  // serialize() the object through JSON before adding to cache
  // all values must be JSON-stringified before being added to the cache
  newValue = objSerializer.serialize(value);

  // new object to set in the cache
  objToSet[key] = newValue;

  // cached collection object that gets added to the queue
  cachedObj[namespace] = key;

  return {
    objectToSet: objToSet,
    objectCacheReference: cachedObj
  }

};

/*
*  @metaData   Object (contains the object to set and its reference)
*  @namespace  String
*
*  Private API Method
*
*  _retryCachingObject() implements a try/catch block for setting the namespaced object to set
*  and a recursive method, in case of failure.
*
*  The method attempts to get the namespaced array in the cache if it exists, if not, it will
*  create one. Once the namespace array has been gotten or received, it will push the object to set
*  into the its proper namespace, as well as the cached object reference in the collectionQueue.
*
*  The collectionQueue is an array that keeps a reference, chronologically, by length, as to the
*  order of when objects were put in the queue.
*
*  In case of failure, the garbage collector will remove items from the cache in the order by
*  which they were put in and retry caching the object.
*
* */
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
    // recursively retry caching the object
    this._retryCachingObject(metaData, namespace)
  }

};

/*
*
*  @key        String
*  @setsToSet  Array (An array of all objects to set)
*  @namespace  String
*
*  Public API Method -- Setter for Sets of Data
*
*  setCategoricalSets() is responsible for setting "categorical" sets -- the value --, with its
*  key, in the proper namespace of the cache. Because the data to set can be an arbitrary length,
*  it's size needs to be standardized so that all serialized sets will be the same size. After
*  standardizing each set into defined chunkSizes, each set is serialized, through the Tamper
*  serialization protocol. As the sets are serialized, a counter is added so that we also keep
*  track of the order each set was added. Finally, _retryCachingCategoricalSets recursively tries
*  to add the entire set -- value -- and key to the proper namespace.
*
*
* */
CacheManager.prototype.setCategoricalSets = function setCategoricalSets(key, setsToSet, namespace) {
  var meta, setsOnSets,
      setsMetaData = [],
      setSerializer = this.setSerializer;

  //throw error if key is not a string
  if ((key && namespace) === typeof String) {
    throw ('Error. Key and namespace are not strings')
  }

  // standardize each size that is set in the cache
  setsOnSets = this._standardizeEachSet(setsToSet);

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

/*
*
*  @setsToSet   Array (An array of all objects to set)
*
*  Private API Method
*
*
*  _standardizeEachSet() is responsible for making sure each arbitrarily-long set of data to be cached
*  is normalized into chunks.
*
* */
CacheManager.prototype._standardizeEachSet = function _standardizeEachSet(setsToSet) {
  var setsOnSets,
    sets = [],
    chunkSize = 3;

  // split setsToSet into chunks so that we can normalize each incoming set to a standard size
  if (setsToSet.length >= chunkSize) {
    setsOnSets = this._splitSetsToChunks(setsToSet, chunkSize);
  } else {
    //setsOnSets must be a nested array, even if it doesn't need to be split into chunks
    setsOnSets = sets.push(setsToSet);
  }

  return setsOnSets;
};

/*
*
*  @setsToSet    Array (An array of all objects to set)
*  @chunkSize    Integer
*
*  Private API Method
*
*  _splitSetsToChunks is responsible for splitting each categorical set of arbitrary-length to a
*  defined chunkSize
*
* */
CacheManager.prototype._splitSetsToChunks = function _splitSetsToChunks(setsToSet, chunkSize) {
  var results = [];
  while (setsToSet.length) {
    results.push(setsToSet.splice(0, chunkSize));
  }
  return results;
};

/*
*  @setsMetaData   Array (An array of all objects to set)
*  @key            String
*  @namespace      String
*
*  Private API Method
*
*  _retryCachingCategoricalSets() implements a try/catch block for setting the namespaced data to set
*  and a recursive method, in case of failure.
*
*  The method iterates through the setsMetaData and dynamically creates a key for each item in the set,
*  from the index of each item. The try block then attempts to call setObject() on each item in the set.
*
*  In case of failure, the garbage collector will remove items from the cache in the order by which they
*  were put in and retry caching the object.
*
* */
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

/*
*  @key        String
*  @namespace  String
*
*  Public API Method -- Getter for Sets of Data
*
*  getObject() is responsible for returning the deserialized value of the individual object you are querying,
*  based on the key and the namespace. After finding the namespaced array in the cache, the method
*  iterates through each of those items in the array and if any of the keys match the key you provide,
*  that item will be returned.
*
*  In order to take item out of the cache, item must first to be deserialized via JSON protocol.
*  After the JSON deserialization process, the object is returned.
*
* */
CacheManager.prototype.getObject = function getObject(key, namespace) {
  var objToDeserialize, cachedItemsNamespaced, el,
      deserializedObj,
      storage = this.storageSpace.localStorage,
      objSerializer = this.objectSerializer;

  //throw error if key or namespace is not a string
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

/*
*  @key         String
*  @namespace   String
*
*  Public API Method -- Getter for Sets of Data
*
*  getCategoricalSets() is responsible for returning the deserialized value of the individual
*  object you are querying, based on the key and the namespace. After returning the deserialized
*  object that contains the set of categorical compressed data, that data must be deserialized
*  itself.
*
*  In order to deserialize the categorical set of data, the categorical set must first be deserialized
*  via a Tamper decoding deserialization protocol.
*
* */
CacheManager.prototype.getCategoricalSets = function getCategoricalSets(key, namespace) {
  var setsToDeserialize,
      deserializedSet,
      setSerializer = this.setSerializer;

  //throw error if key is not a string
  if ((key && namespace) === typeof String) {
    throw ('Error. Key and namespace are not strings')
  }

  //JSON.parse[s the (TamperObj)]
  setsToDeserialize = this.getObject(key, namespace);

  deserializedSet = setSerializer.deserialize(setsToDeserialize);

  return deserializedSet
};

module.exports = CacheManager;