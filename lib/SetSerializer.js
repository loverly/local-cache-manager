var AbstractSerializer = require('./AbstractSerializer.js');

var SetSerializer = function SetSerializer() {};

//Extend the AbstractSerializer
SetSerializer.prototype = Object.create(AbstractSerializer.prototype);
SetSerializer.prototype.AbstractSerializer = AbstractSerializer;


SetSerializer.prototype.serialize = function serialize(itemsToSet) {

  throw new Error('set serialization method');

};

SetSerializer.prototype.deserialize = function deserialize() {

  throw new Error('set deserialization method');

};

module.exports = SetSerializer;