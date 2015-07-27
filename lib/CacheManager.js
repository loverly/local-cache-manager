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
  var newValue, nameSpacedData, hasNameSpace, objToSet,
      storageSpace = this.storageSpace,
      objSerializer = this.objectSerializer,
      collection = this.collection,
      collector = this.collector;

  newValue = objSerializer.serialize(value);

  objToSet = {serializedData: newValue};

  //if @namespace param is present
  if (namespace) {
    hasNameSpace = storageSpace.getItem(namespace);
    //if storageSpace doesn't have the namespace
    if (!hasNameSpace) {
      //create a key in the storage space with the name of the namespace and the value of an array
      storageSpace.setItem(namespace, []);
      nameSpacedData = storageSpace.getItem(namespace);



      nameSpacedData.push(objToSet);

      // Push the data into the collection
      collection.push(objToSet);

      // if storageSpace does have the namespace
    } else {
      nameSpacedData = storageSpace.getItem(namespace);

      //console.log('i the data', nameSpacedData, objToSet)
      nameSpacedData.push(objToSet)
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
  var meta, setsOnSets, newValues, newSetKey,
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


  try {
    setsMetaData.forEach(function (set, index) {
      newSetKey = key + '-setid-' + index;
      newValues = set.serializedData;

      this.setObject(newSetKey, newValues, namespace)

      // push the data into the collection
      collection.push(meta);
    });
  }

  catch(err) {
    this._debug('Err has been found, ', err);

    collector.cleanup(storageSpace, collection);
    //this.setCategoricalSets(key, newValues, namespace)
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