var AbstractSerializer = require('./AbstractSerializer.js');

var SetSerializer = function SetSerializer(tamp) {
  this.tamp = tamp;
};

//Extend the AbstractSerializer
SetSerializer.prototype = Object.create(AbstractSerializer.prototype);
SetSerializer.prototype.AbstractSerializer = AbstractSerializer;


SetSerializer.prototype.serialize = function serialize(objectsToSet) {
  var _this = this,
      values,
      el,
      key,
      packedData,
      hashMap = {};

  //creates a hash of keys with each value being an array
  objectsToSet.forEach(function(obj){
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

  //console.log('Objects', objectsToSet);

  // pack all data
  packedData = this._packData(hashMap, objectsToSet);

  return packedData;
};

SetSerializer.prototype._packData = function _packData(preSerializedObj, rawPreSerializedData) {
  var _this = this,
      el,
      newPack,
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
  packer.pack(rawPreSerializedData);

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

SetSerializer.prototype.deserialize = function deserialize() {

  throw new Error('set deserialization method');

};

module.exports = SetSerializer;