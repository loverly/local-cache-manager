var AbstractSerializer = require('./AbstractSerializer.js'),
/*
 *  AbstractSerializer() is responsible for serializing/deserializing --
 *  compressing/decompressing all categorical sets data before it is
 *  put in the storage space, when set, and before it is returned from
 *  the storage space, when gotten.
 *
 *  @encoder    Tamper Encoder Object that is responsible for the
 *              serialization protocol -- before object is set in cache
 *
 *  @decoder    Tamper Decoder Object that is responsible for the
 *              deserialization protocol -- before object is gotten from
 *              the cache
 *
 * */
  SetSerializer = function SetSerializer(encoder, decoder) {
    this.encoder = encoder;
    this.decoder = decoder;
  };

//Extend the AbstractSerializer
SetSerializer.prototype = Object.create(AbstractSerializer.prototype);
SetSerializer.prototype.AbstractSerializer = AbstractSerializer;

/*
 *  @setsToSerialize    Array (an array of objects that will be 'packed')
 *
 *  Public API Method
 *
 *  serialize() (1) packs the entire set of objects by creating an encoded
 *  object with _packedData() and (2) keeps a count of all items in the
 *  set. This count will be used later to help the garbage collector
 *  choose which items to cleanup() and which order to clean them out
 *  as the algorithm is a FIFO, first in, first out.
 *
 *  serialize() returns an object that contains the packed data -- an array
 *  of objects, and the order in which those items were added -- an object.
 *
 * */
SetSerializer.prototype.serialize = function serialize(setToSerialize) {
  var values, el, key, packedData, meta,
    _this = this,
    orderCachedById = {},
    attrNamesAndPossibilities = {};

  //creates a hash of keys with each value being an array
  setToSerialize.forEach(function (obj, index) {
    if (_this._isObject(obj)) {
      for (key in obj) {
        attrNamesAndPossibilities[key] = attrNamesAndPossibilities[key] || [];
        attrNamesAndPossibilities[key].push(obj[key]);
        orderCachedById[obj.id] = orderCachedById[obj.id] || index;
      }
      return attrNamesAndPossibilities && orderCachedById;
    }
  });

  //takes all values, returns only unique values, and add to array
  for (el in attrNamesAndPossibilities) {
    values = attrNamesAndPossibilities[el].filter(_this._onlyUniqueKeys);
    attrNamesAndPossibilities[el] = values;
  }

  packedData = this._packData(attrNamesAndPossibilities, setToSerialize);

  meta = {
    // turn packedData to a plan JS Object
    serializedData: packedData.toPlainObject(),
    itemsAddedCounter: orderCachedById
  };

  return meta;
};

/*
 *  @preSerializedObject    Object
 *  @setToSerialize         Array  (All of the objects in the set that will be
 *                                  serialized.)
 *
 *  Private Helper Method
 *
 *  _packData() is a helper method that uses the packer encoder to compress
 *  each of the sets. This method makes use of addAttribute() and pack(), both
 *  public API methods available from the Tamper encoder.
 *
 *  _packData returns an object that has all keys, and all of their possible values,
 *  along with relevant meta data information
 *
 * */
SetSerializer.prototype._packData = function _packData(preSerializedObj, setToSerialize) {
  var _this = this,
    el,
    encoder = this.encoder,
    packer = encoder();

  // Adds packed attributes
  for (el in preSerializedObj) {
    packer.addAttribute({
      attrName: el,
      possibilities: preSerializedObj[el],
      maxChoices: 1
    })
  }
  // Packs the raw data
  packer.pack(setToSerialize);

  return packer;
};

/*
 *  @setsToDeserialize     Object
 *
 *  Public API Method
 *
 *  deserialize() unpacks all of the data with the assistance of helper method,
 *  _unpackData, that uses the Tamper decoder to unpack all of the data before
 *  removing queried data from the cache.
 *
 *  deserialize() returns an array of objects that are deserialized and decompressed.
 *
 * */
SetSerializer.prototype.deserialize = function deserialize(setsToDeserialize) {
  var unpackedData;

  unpackedData = this._unpackData(setsToDeserialize);
  return unpackedData;
};
/*
 *  @setsToDeserialize    Object
 *
 *  Private Helper Method
 *
 *  _unpackData() is a private helper method that uses the Tamper decoder to
 *  unpack all of the data
 *
 * _unpackData() returns an array of objects that are deserialized and decompressed.
 *
 * */
SetSerializer.prototype._unpackData = function _unpackData(setsToDeserialize) {
  var _this = this, item, data,
    unpackedData,
    objectData,
    decoder = this.decoder,
    unpacker = decoder.Tamper();

  for (item in setsToDeserialize) {
    data = setsToDeserialize[item];
    objectData = JSON.parse(data);
    unpackedData = unpacker.unpackData(objectData);
  }

  return unpackedData
};

/*
 *  @item     Anything
 *
 *  Private Utility Method
 *
 *  _isObject() checks to see if the item is an object
 *
 *  _isObject() returns a boolean value, true or false
 *
 * */
SetSerializer.prototype._isObject = function _isObject(item) {
  return item === Object(item);
};
/*
 *  @value
 *  @index
 *  @self
 *
 *  Private Utility Method
 *
 *  _onlyUniqueKeys() checks to see if the key is unique within the array
 *
 *  _onlyUniqueKeys() returns a boolean value, true or false
 *
 * */
SetSerializer.prototype._onlyUniqueKeys = function _onlyUniqueKeys(value, index, self) {
  return self.indexOf(value) === index;
};

module.exports = SetSerializer;