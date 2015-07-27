var CacheManager = function CacheManager(options, storageSpace, garbageCollector, objectSerializer, setSerializer) {
  this.options          = options;
  this.name             = options.name;
  this.debug            = options.debug;

  this.storageSpace     = storageSpace;
  this.collector        = garbageCollector;
  this.objectSerializer = objectSerializer;
  this.setSerializer    = setSerializer;

  this.collection       = [];
};

CacheManager.prototype._debug = function _debug(msg){
  if (this.debug) {
    console.log(msg)
  }
};

// when items are added, both sets and individual objects, get the count and time, add it
// to the meta data object

CacheManager.prototype.setObject = function setObject(key, value, namespace) {
  var newValue, hasNameSpace, nameSpacedData,
      objToSet = {},
      cachedObj = {},
      storageSpace = this.storageSpace,
      objSerializer = this.objectSerializer,
      collection = this.collection,
    //TODO wrap in a try/catch block that will call .cleanup() in case of err
      collector = this.collector,

      // serialize() the object through JSON before adding to cache
      // all values must be JSON-stringified before being added to the cache
      newValue = objSerializer.serialize(value);

  // object to set in the cache
  objToSet[key] = newValue;
  // cached collection object that gets added to the queue
  cachedObj[namespace] = key;

  //if @namespace param is present
  if (namespace) {
    hasNameSpace = storageSpace.getItem(namespace);
    //if storageSpace doesn't have the namespace
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

  } else {
    throw Error('Namespace for cache must be given.')
  }

};

CacheManager.prototype._splitSetsToChunks = function _splitSetsToChunks(setsToSet, chunkSize) {
  var results = [];
  while (setsToSet.length) {
    results.push(setsToSet.splice(0, chunkSize));
  }
  return results;
};

CacheManager.prototype.setCategoricalSets = function setCategoricalSets(key, setsToSet, namespace) {
  var meta, setsOnSets, newValue, newKey,
      _this = this,
      sets = [],
      setsMetaData = [],
      storageSpace = this.storageSpace,
      setSerializer = this.setSerializer,
      collector = this.collector,
      collection = this.collection,
      chunkSize = 3;

  // split setsToSet into chunks so that we can normalize each incoming set to a standard size
  if (setsToSet.length >= chunkSize) {
    setsOnSets = this._splitSetsToChunks(setsToSet, chunkSize);
  } else {
    //setsOnSets must be a nested array, even if it doesn't need to be split into chunks
    setsOnSets = sets.push(setsToSet);
  }
  // for each array of sets (each set contains three items)
  setsOnSets.forEach(function(sets, index){
    // serialize the set and return the meta object from SetSerializer()
    meta = setSerializer.serialize(sets);
    meta.setAddedCounter = index;
    // setsMetaData is the array we use with which to set each of the objects --> setObject()
    setsMetaData.push(meta);
    return setsMetaData;
  });

  // if there is no space in the local cache
  if (storageSpace.length) {
    this._retry(setsMetaData); //wrap in a conditional to meet basecase
  }
};

CacheManager.prototype._retry = function _retry(setsMetaData){
  var newKey, key, newValue, namespace,
      storageSpace = this.storageSpace,
      collection = this.collection,
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
    this._debug(' Err found. 5 MB Limit of cache reached. ');
    collector.cleanup(storageSpace, collection);

    this._retry(setsMetaData);
    // remove one item from the collection
    // try to setObject() of the elements
    // if fail again remove another item from the collection
    // try to setObject() of the elements
    // keep trying until
    //      (1) elements successfully added
    //      (2) no items are left to remove from the cache
  }

};



CacheManager.prototype.getObject = function getObject(key) {
  var objToDeserialize,
      deserializedObj,
      storageSpace = this.storageSpace,
      objSerializer = this.objectSerializer;

  //throw error if key is not a string
  if (!key === typeof String) {
    throw ('Error key is not a string')
  }

  //forces key to be a string if it's not
  objToDeserialize = storageSpace[key];

  //deseralized the object
  deserializedObj = objSerializer.deserialize(objToDeserialize);

  return deserializedObj;
};

CacheManager.prototype.getCategoricalSets = function getCategoricalSets(key) {
  var setsToDeserialize,
      deserializedSet,
      setSerializer = this.setSerializer;

  //JSON.parse[s the (TamperObj)]
  setsToDeserialize = this.getObject(key);

  deserializedSet = setSerializer.deserialize(setsToDeserialize);

  return deserializedSet
};

module.exports = CacheManager;