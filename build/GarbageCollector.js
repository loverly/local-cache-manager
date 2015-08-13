define(function(){
  /*
   *   GarbageCollector() is responsible for all storage needs.
   *
   *   The storage is affected by capacity and time. As capacity is reached, the
   *   Garbage Collector will implement a first in, first out queue so that older
   *   items are removed from the persistent storage first. Also, as items in persistent
   *   become outdated, they are removed from the persistent storage.
   *
   *   The GarbageCollector class is concerned with:
   *   (1) providing enough space for the CacheManager class to store items and
   *   (2) maximizing the hit ratio for the cache
   *
   * */
  var GarbageCollector = function GarbageCollector() {};
  /*
   *  @storageSpace    Window Object's persisted localStorage or session-based sessionStorage
   *  @itemToRemove    Object (Object Reference to the last item added to the cache)
   *
   *  Private API Method
   *
   *  Helper method _removeFirstAddedItem() helps public cleanup() implementing a FIFO algorithm
   *  that removes the last element entered from the cache. Using the itemToRemove object reference,
   *  _removeFirstAddedItem() looks at all items that have been cached and if the key matches the
   *  key of the itemToRemove, then remove that item
   *
   * */
  GarbageCollector.prototype._removeFirstItemAdded = function _removeFirstItemAdded(storageSpace, itemToRemove) {
    var k, itemKey, namespace, keyValue, cachedItems;

    // the key is the namespace; the value is the key of the item
    for (k in itemToRemove) {
      namespace = k;
      keyValue = itemToRemove[k];
    }

    // cached items array that are namespaced
    cachedItems = storageSpace.localStorage[namespace];

    cachedItems.forEach(function (item, index) {
      for (itemKey in item) {
        if (itemKey == keyValue) {
          // will remove the element at the index of the item
          cachedItems.splice(index, 1);
        }
      }
    });
  };

  /*
   *  @storageSpace   Window Object's persisted localStorage or session-based sessionStorage
   *  @setsQueue      Array (An array of object references that has every item in the cache,
   *                         in the order they were added.)
   *
   *  Public API Method
   *
   *  cleanup() implements a FIFO algorithm  as it removes the first item from the storage
   *  space by checking a queue of object references
   *
   * */
//TODO: Add cleanupType as third parameter that will be a flag for how to cleanup -- which algo to use
  GarbageCollector.prototype.cleanup = function cleanUp(storageSpace, setsQueue) {
    var itemToRemove;

    //console.log(setsQueue, 'queue')

    itemToRemove = setsQueue.shift();
    this._removeFirstItemAdded(storageSpace, itemToRemove);
  };

  return GarbageCollector;

});