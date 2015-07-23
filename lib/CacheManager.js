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
      serializer = this.objectSerializer;

  newValue = serializer.serialize(value);
  storageSpace.setItem(key, newValue)
};

CacheManager.prototype.setCategoricalSets = function setItems(key, itemsToSet) {
  var newValues,
      storageSpace = this.storageSpace,
      serializer = this.setSerializer;

  newValues = serializer.serialize(itemsToSet);
  storageSpace.setItem(key, newValues);
};

CacheManager.prototype.getObject = function getItem(key) {

};

CacheManager.prototype.getCategoricalSets = function getCategoricalSets(key) {

};

module.exports = CacheManager;