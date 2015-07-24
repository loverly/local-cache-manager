var AbstractSerializer = require('./AbstractSerializer');

var ObjectSerializer = function ObjectSerializer() {};

//Extend the AbstractSerializer
ObjectSerializer.prototype = Object.create(AbstractSerializer.prototype);
ObjectSerializer.prototype.AbstractSerializer = AbstractSerializer;


ObjectSerializer.prototype.serialize = function serialize(objToSerialize) {
  //TODO: investigate protobuf-for-nde module for serializing individual objects
  return JSON.stringify(objToSerialize);
};

ObjectSerializer.prototype.deserialize = function deserialize(objToDeserialize) {
  return JSON.parse(objToDeserialize);
};

module.exports = ObjectSerializer;