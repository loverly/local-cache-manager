var CacheManager = function CacheManager(options, storageSpace, garbageCollector, objectSerializer, setSerializer) {
  this.options          = options;
  this.name             = options.name;
  this.debug            = options.debug;

  this.storageSpace     = storageSpace;
  this.collector        = garbageCollector;
  this.objectSerializer = objectSerializer;
  this.setSerializer    = setSerializer;
};

CacheManager.prototype._debug = function _debug(msg){
  if (this.debug) {
    console.log(msg)
  }
};

CacheManager.prototype.setObject = function setObject(key, value) {
  var newValue,
      storageSpace = this.storageSpace,
      objSerializer = this.objectSerializer;


  newValue = objSerializer.serialize(value);

  storageSpace.setItem(key, newValue)
};

CacheManager.prototype._splitSetsToChunks = function _splitSetsToChunks(setsToSet, chunkSize) {
  var results = [];
  while (setsToSet.length) {
    results.push(setsToSet.splice(0, chunkSize));
  }
  return results;
};

CacheManager.prototype.setCategoricalSets = function setCategoricalSets(key, setsToSet) {
  var meta, setsOnSets, orderCachedById, newValues,
      setsMetaData = [],
      storageSpace = this.storageSpace,
      setSerializer = this.setSerializer,
      collector = this.collector;

  // split setsToSet into chunks so that we can normalize each incoming set to a standard size
  setsOnSets = this._splitSetsToChunks(setsToSet, 3);

  setsOnSets.forEach(function(sets, index){
    // serialize the set and return the meta object from SetSerializer()
    meta = setSerializer.serialize(sets);
    meta.setAddedCounter = index;

    setsMetaData.push(meta);
    return setsMetaData;
  });

  try {
    setsMetaData.forEach(function (set) {
      newValues = set.serializedData;
      // need some way to dynamically generate keys for newValues
      // possibly build namespaces in now so that data can be namespaced into different parts
      // of local cache
      // setObject(namespace, key, values)
      //this.setObject('mobile.articles', key, newValues)
      this.setObject(key, newValues)
    });

  }

  catch(err) {
    if (err) {this._debug('Err has been found, ', err)};
    collector.cleanup(storageSpace);
    this.setCategoricalSets(key, newValues)
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