define(function(){
  var AbstractSerializer = require('./AbstractSerializer');
  /*
   *  AbstractSerializer() is responsible for serializing/deserializing --
   *  compressing/decompressing all individual object data before it is
   *  put in the storage space, when set, and before it is returned from
   *  the storage space, when gotten.
   *
   *  @encoder    JSON stringify protocol is responsible for the serialization process
   *             -- before object is set in cache
   *
   *  @decoder    JSON parse protocol is responsible for the deserialization process
   *             -- before object is gotten from the cache
   *
   * */
  var ObjectSerializer = function ObjectSerializer() {
    this.encoder = JSON.stringify;
    this.decoder = JSON.parse;
  };

//Extend the AbstractSerializer
  ObjectSerializer.prototype = Object.create(AbstractSerializer.prototype);
  ObjectSerializer.prototype.AbstractSerializer = AbstractSerializer;

  /*
   *  @objToSerialize   Object, String, Number, Array
   *   -- there is no restriction as to the data type that can be set in the
   *      cache
   *
   *  Public API Method
   *
   *  serialize() stringifies the object that you want to serialize and
   *  returns that object to you.
   *
   * */
  ObjectSerializer.prototype.serialize = function serialize(objToSerialize) {
    return this.encoder(objToSerialize);
  };

  /*
   *  @objToSerialize   Object, String, Number, Array
   *   -- there is no restriction as to the data type that can be set in the
   *      cache
   *
   *  Public API Method
   *
   *  deserialize() parses the object that you want to deserialize and
   *  returns that object to you.
   *
   * */
  ObjectSerializer.prototype.deserialize = function deserialize(objToDeserialize) {
    //TODO: Get Brandon's help; need to JSON.parse object? or just return it?
    //return this.decoder(objToDeserialize);
    return objToDeserialize
  };

  return ObjectSerializer;

});