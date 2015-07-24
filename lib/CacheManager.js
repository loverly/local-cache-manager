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

CacheManager.prototype.setCategoricalSets = function setItems(key, setsToSerialize) {
  var newValues,
      storageSpace = this.storageSpace,
      setSerializer = this.setSerializer;

  newValues = setSerializer.serialize(setsToSerialize, storageSpace);
  storageSpace.setItem(key, newValues);
};

CacheManager.prototype.getObject = function getItem(key) {
  var storageSpace = this.storageSpace,
      objSerializer = this.objectSerializer;

  //TODO: make sure that @key is a string
  //TODO: add deserialize method if necessary for ObjectSerializer()

  return storageSpace.getItem(key);
};

CacheManager.prototype.getCategoricalSets = function getCategoricalSets(key) {
  var setsToDeserialize,
      storageSpace = this.storageSpace,
      setSerializer = this.setSerializer;

  setsToDeserialize = storageSpace[key];

  return setSerializer.deserialize(setsToDeserialize);
};

module.exports = CacheManager;