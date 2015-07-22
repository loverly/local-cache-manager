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


SetSerializer.prototype.serialize = function serialize(itemsToSet) {



  throw new Error('set serialization method');

};

SetSerializer.prototype.deserialize = function deserialize() {

  throw new Error('set deserialization method');

};

module.exports = SetSerializer;