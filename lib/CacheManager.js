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

CacheManager.prototype.setCategoricalSets = function setCategoricalSets(key, setsToSet, serialize) {
  var newValues, meta,
      _this = this,
      storageSpace = this.storageSpace,
      setSerializer = this.setSerializer,
      collector = this.collector;

  // serialize the new values regardless, in case of retry from err
  // if data needs to be serialized
  if (serialize) {
    meta = setSerializer.serialize(setsToSet);
    newValues = meta.serializedData;
    try {
      _this.setObject(key, newValues);
    }
    catch (err) {
      // cleans out the collector queue FIFO
      //collector.cleanUp(storageSpace);
      // retry setting the object, but with serialized values
      this.setCategoricalSets(key, newValues, true);
    }
    // if data has already been serialized
  } else if (!serialize) {
    try {
      _this.setObject(key, setsToSet)
    }
    catch (err) {
      this.setCategoricalSets(key,setsToSet, false)
    }
  } else {
    throw('Should this Data be serialized? --> boolean flag as third parameter')
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