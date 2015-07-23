var AbstractSerializer = require('./AbstractSerializer.js');

var SetSerializer = function SetSerializer(tamp) {

  initTamp(tamp);

  this.tamp = tamp;
};

//Extend the AbstractSerializer
SetSerializer.prototype = Object.create(AbstractSerializer.prototype);
SetSerializer.prototype.AbstractSerializer = AbstractSerializer;

function initTamp(tamp) {
  tamp();
};

SetSerializer.prototype.serialize = function serialize(objectsToSet) {
  var _this = this,
      itemKeys,
      uniqueKeys,
      key;

  var nestedKeys = [],
      hashMap = {};

  var preSerialized = {};
      preSerialized.keys = [];


  objectsToSet.forEach(function(obj){
    if (isObject(obj)) {
      itemKeys = Object.keys(obj);
      nestedKeys.push(itemKeys);

      for (key in obj) {
        //console.log(key, 'Key')
        //console.log(obj[key], 'Value')
        hashMap[key] = obj[key]
        console.log(hashMap, 'hash Map')

      }

    }
    return nestedKeys;
  });

  uniqueKeys = nestedKeys.reduce(toMergedArray).filter(onlyUniqueKeys);

};

function isObject(item) {
  return item === Object(item);
}

function onlyUniqueKeys(value, index, self) {
  return self.indexOf(value) === index;
}

function toMergedArray(a, b) {
  return a.concat(b);
}

SetSerializer.prototype.deserialize = function deserialize() {

  throw new Error('set deserialization method');

};

module.exports = SetSerializer;