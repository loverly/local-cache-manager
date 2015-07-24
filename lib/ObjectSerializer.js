var AbstractSerializer = require('./AbstractSerializer');

var ObjectSerializer = function ObjectSerializer() {};

//Extend the AbstractSerializer
ObjectSerializer.prototype = Object.create(AbstractSerializer.prototype);
ObjectSerializer.prototype.AbstractSerializer = AbstractSerializer;


ObjectSerializer.prototype.serialize = function serialize(value) {
  //TODO: investigate protobuf-for-nde module for serializing individual objects
  return JSON.stringify(value)
};

ObjectSerializer.prototype.deserialize = function deserialize() {
  throw new Error('object deserialization method')
};

module.exports = ObjectSerializer;