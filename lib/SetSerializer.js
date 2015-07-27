var AbstractSerializer = require('./AbstractSerializer.js');

var SetSerializer = function SetSerializer(encoder, decoder) {
  this.encoder = encoder;
  this.decoder = decoder;
};

//Extend the AbstractSerializer
SetSerializer.prototype = Object.create(AbstractSerializer.prototype);
SetSerializer.prototype.AbstractSerializer = AbstractSerializer;


/*
* @setsToSerialize, an array of objects that will be 'packed'
*
* serialize() (1) packs the entire set of objects by creating an encoded
* object with _packedData() and (2) keeps a count of all items in the
* set. This count will be used later to help the garbage collector
* choose which items to cleanup() and which order to clean them out
* as the algorithm is a FIFO, first in, first out.
*
* */
SetSerializer.prototype.serialize = function serialize(setToSerialize) {
  var values, el, key, packedData, meta,
    _this = this,
      orderCachedById = {},
      attrNamesAndPossibilities = {};

  //creates a hash of keys with each value being an array
  setToSerialize.forEach(function(obj, index){
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

  // pack an array of all packed data
  packedData = this._packData(attrNamesAndPossibilities, setToSerialize);

  // includes packed data, which will be a JS object and the order in which
  // items in the set were cached by ID
  meta = {
    // turn packedData to a plan JS Object
    serializedData: packedData.toPlainObject(),
    itemsAddedCounter: orderCachedById,
  };

  return meta;
};

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

SetSerializer.prototype.deserialize = function deserialize(setsToDeserialize) {
  var unpackedData;
  unpackedData = this._unpackData(setsToDeserialize);
  return unpackedData;
};


// @setsToDeserialize should be an Object
SetSerializer.prototype._unpackData = function _unpackData(setsToDeserialize) {
  var _this = this, item, data,
    unpackedData,
    decoder = this.decoder,
    unpacker = decoder.Tamper();

  for (item in setsToDeserialize) {
    data = setsToDeserialize[item]
    unpackedData = unpacker.unpackData(data)
  }

  return unpackedData
};

SetSerializer.prototype._isObject = function _isObject(item) {
  return item === Object(item);
};

SetSerializer.prototype._onlyUniqueKeys = function _onlyUniqueKeys(value, index, self) {
  return self.indexOf(value) === index;
};

SetSerializer.prototype._toMergedArray = function _toMergedArray(a, b) {
  return a.concat(b);
};

module.exports = SetSerializer;