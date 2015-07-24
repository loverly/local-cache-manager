var AbstractSerializer = require('./AbstractSerializer.js');

var SetSerializer = function SetSerializer(tamp) {
  this.tamp = tamp;
};

//Extend the AbstractSerializer
SetSerializer.prototype = Object.create(AbstractSerializer.prototype);
SetSerializer.prototype.AbstractSerializer = AbstractSerializer;


SetSerializer.prototype.serialize = function serialize(setsToSerialize) {
  var _this = this,
      values,
      el,
      key,
      packedData,
      hashMap = {};

  //creates a hash of keys with each value being an array
  setsToSerialize.forEach(function(obj){
    if (_this._isObject(obj)) {
      for (key in obj) {
        hashMap[key] = hashMap[key] || [];
        hashMap[key].push(obj[key])
      }
      return hashMap;
    }
  });

  //takes all values, returns only unique values, and add to array
  for (el in hashMap) {
    values = hashMap[el].filter(_this._onlyUniqueKeys);
    hashMap[el] = values;
  }

  // pack all data
  packedData = this._packData(hashMap, setsToSerialize);
  return packedData;
};

SetSerializer.prototype.deserialize = function deserialize(setsToDeserialize) {
  var unpackedData;

  unpackedData = this._unpackData(setsToDeserialize);

  console.log(unpackedData, 'Data');

  return unpackedData;
};

SetSerializer.prototype._unpackData = function _unpackData(setsToDeserialize) {
  var _this = this,
    unpackedData,
    tamp = this.tamp,
    packer = tamp();

  console.log(packer);

  unpackedData = packer.unpackData(setsToDeserialize);

  return unpackedData
};

SetSerializer.prototype._packData = function _packData(preSerializedObj, setsToSerialize) {
  var _this = this,
      el,
      tamp = this.tamp,
      packer = tamp();

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