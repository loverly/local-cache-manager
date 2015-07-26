/*
* Responsible for all storage needs.
*
* The storage is affected by capacity and time. As capacity is reached, the
* Garbage Collector will implement a first in, first out queue so that older
* items are removed from the persistent storage first. Also, as items in persistent
* become outdated, they are removed from the persistent storage.
*
* The GarbageCollector class is concerned with:
* (1) providing enough space for the CacheManager class to store items and
* (2) maximizing the hit ratio for the cache
*
*
*
* */

/*
function sizeofAllStorage() {  // provide the size in bytes of the data currently stored
  var size = 0;
  for (i = 0; i <= localStorage.length - 1; i++) {
    key = localStorage.key(i);
    size += lengthInUtf8Bytes(localStorage.getItem(key));
  }
  return size;
}

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

console.log(sizeofAllStorage());
*/

var GarbageCollector = function GarbageCollector(){

};

GarbageCollector.prototype.hasSpace = function hasSpace() {

};


//GarbageCollector.protoype.cleanUp = function cleanUp(storageSpace) {


  //storageSpace.removeItem(itemsToRemove)
//};

module.exports = GarbageCollector;