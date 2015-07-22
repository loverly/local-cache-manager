var AbstractSerializer = require('./AbstractSerializer.js'),
    createTamp = require('tamp');


var SetSerializer = function SetSerializer(tamp) {
  this.tamp = tamp;

};

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