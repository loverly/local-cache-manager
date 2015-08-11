/*
 *  AbstractSerializer() is responsible for being a standard common interface that extends
 *  all Serializer objects -- both ObjectSerializer() and SetSerializer().
 *
 *  As the AbstractSerializer is extended for both of those child serializer classes, all
 *  Serializer() objects have both serialize() and deserialize() methods
 *
 * */
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