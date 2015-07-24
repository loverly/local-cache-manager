var AbstractSerializer = function AbstractSerializer(options) {
  this.options = options;

};

AbstractSerializer.prototype.serialize = function serialize() {

  throw new Error('Not yet implemented.')

};

AbstractSerializer.prototype.deserialize = function deserialize() {

  throw new Error('Not yet implemented.')

};

module.exports = AbstractSerializer;