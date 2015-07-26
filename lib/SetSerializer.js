var AbstractSerializer = require('./AbstractSerializer.js');

var SetSerializer = function SetSerializer(encoder, decoder) {
  this.encoder = encoder;
  this.decoder = decoder;
};

//Extend the AbstractSerializer
SetSerializer.prototype = Object.create(AbstractSerializer.prototype);
SetSerializer.prototype.AbstractSerializer = AbstractSerializer;


SetSerializer.prototype.serialize = function serialize(setsToSerialize) {
  var values, el, key, packedData, meta,
    _this = this,
      counter = {},
      attrNamesAndPossibilities = {};

  //creates a hash of keys with each value being an array
  setsToSerialize.forEach(function(obj, index){
    if (_this._isObject(obj)) {
      for (key in obj) {
        attrNamesAndPossibilities[key] = attrNamesAndPossibilities[key] || [];
        attrNamesAndPossibilities[key].push(obj[key]);
        counter[obj.id] = counter[obj.id] || index;
      }
      return attrNamesAndPossibilities && counter;
    }
  });

  //takes all values, returns only unique values, and add to array
  for (el in attrNamesAndPossibilities) {
    values = attrNamesAndPossibilities[el].filter(_this._onlyUniqueKeys);
    attrNamesAndPossibilities[el] = values;
  }

  // pack an array of all packed data
  packedData = this._packData(attrNamesAndPossibilities, setsToSerialize);

  meta = {
    // turn packedData to a plan JS Object
    serializedData: packedData.toPlainObject(),
    addedCounter: counter
  };

  return meta;
};

SetSerializer.prototype._packData = function _packData(preSerializedObj, setsToSerialize) {
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
  packer.pack(setsToSerialize);

  return packer;
};

SetSerializer.prototype.deserialize = function deserialize(setsToDeserialize) {
  var unpackedData;

  unpackedData = this._unpackData(setsToDeserialize);
  return unpackedData;
};

SetSerializer.prototype._unpackData = function _unpackData(setsToDeserialize) {
  var _this = this,
    unpackedData,
    decoder = this.decoder,
    unpacker = decoder.Tamper();

  unpackedData = unpacker.unpackData(setsToDeserialize);

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