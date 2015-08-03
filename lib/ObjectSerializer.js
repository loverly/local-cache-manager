var AbstractSerializer = require('./AbstractSerializer');

var ObjectSerializer = function ObjectSerializer() {
  this.encoder = JSON.stringify;
  this.decoder = JSON.parse;

};

//Extend the AbstractSerializer
ObjectSerializer.prototype = Object.create(AbstractSerializer.prototype);
ObjectSerializer.prototype.AbstractSerializer = AbstractSerializer;


ObjectSerializer.prototype.serialize = function serialize(objToSerialize) {
  //TODO: investigate protobuf-for-nde module for serializing individual objects
  return this.encoder(objToSerialize);
};

ObjectSerializer.prototype.deserialize = function deserialize(objToDeserialize) {
  //TODO: Get Brandon's help; need to JSON.parse object? or just return it?
  //return this.decoder(objToDeserialize);

  return objToDeserialize
};

module.exports = ObjectSerializer;