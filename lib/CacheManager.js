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

CacheManager.prototype.setObject = function setItem(key, value) {
  var storageSpace = this.storageSpace,
      serializer = this.objectSerializer,
      collector = this.collector;

  this._debug('setObject()-->');

  serializer.serialize(value);
  storageSpace.setItem(key, value)
};

CacheManager.prototype.setCategoricalSets = function setItems(key, itemsToSet) {

};

CacheManager.prototype.getItem = function getItem(key) {

};

CacheManager.prototype.getCategoricalSets = function getCategoricalSets(key) {

};

module.exports = CacheManager;