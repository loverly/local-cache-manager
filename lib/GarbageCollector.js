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
  this.name = 'collector';
};

GarbageCollector.prototype.hasSpace = function hasSpace() {

};


/*
* Implement a FIFO algorithm that takes the last element entered and removes it last.
*
* Compare what's in the storageSpace cache to what we have in the collection. Collection maintains
* the order in which the items were added to the localStorage object cache. Based upon collection order
* we can pop items out of the collection
*
* 1. Keep popping until successfully adds item to cache
* 2. Until no items are left
*
* ** after pop, add again
*
* */

GarbageCollector.prototype._removeFirstItem = function _removeFirstItem(storageSpace, itemToRemove) {
  var k, namespace, keyValue, cachedItems,
      storage = storageSpace.localStorage;

  // the key is the namespace; the value is the key of the item
  for (k in itemToRemove) {
    namespace = k;
    keyValue = itemToRemove[k];
  }

  // cached items array that are namespaced
  cachedItems = storage[namespace];

  cachedItems.forEach(function (item, index) {
    for (var key in item) {
      if (key == keyValue) {
        // will remove the element at the index of the item
        cachedItems.splice(index, 1);
      }
    }
  });


};

GarbageCollector.prototype.cleanup = function cleanUp(storageSpace, setsQueue) {
  var itemToRemove;
  //removes item from collection --> needs to be updated in queue [as well as the cache]
  itemToRemove = setsQueue.shift();
  //removes element from the cache
  this._removeFirstItem(storageSpace, itemToRemove);
};

module.exports = GarbageCollector;