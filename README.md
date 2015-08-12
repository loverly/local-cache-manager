# local-cache-manager

Serializer
- responsible for (Tamper) serialization protocol
.serialize(obj)   : [Tamper] packs the data
.deserialize(obj) : [Tamper] unpacks the data

AbstractSerializer Class that extends --> defines public API/variables that will be shared for all serializers
- two methods: throw Error('not yet implemented') --> serialize and deserialize + utility functions
- shows the API for what a serializer should be
- look at AbstractServices Class in LVP framework

npm install cache-man

CacheManager
GarbageCollector
AbstractSerializer
SetSerializer
SingleSerializer

-- JSON serialization protocol
-- Tamper serialization protocol

CacheManager --> config to tell which storage it's pointed at
- responsible for managing window.localStorage object
window.localStorage stingifies everything

Public API
.getItem(key)      --> returns an item that is stored in the local cache
.getItems(keys)
.setItem(key, obj={})      --> adds an item to the localCache
.setItems(key, type, obj={})

individual object --> not use Tamper
collection of objects (list of articles) --> integrates Tamper

.removeItem(obj)   --> removes an item from localCache
.removeItems(objs)
.hasKey(objKey)       --> returns whether an obj with the objKey exists in local cache
.length()          --> returns number of elements in the object

** .capacity()        --> returns the capacity at which localStorage is at
.clear()           --> clears the entire cache

Garbage Collector
- (1) providing enough space for the cacheManager to store things and (2) maximizing the hit ratio for the cache
- responsible for storage needs --> removing items as they are no longer needed
Ex., trying to store in cache, returns error, then garbageCollector.cleanup()

Private API functionality
 Helper methods to support public API methods

 Storage
 - capacity   : when capacity is reached for localStorage (FIFO)
 - popularity :
 - time-based : when data is expired/needs to be updated


JSON.stringify(localStorage).length() --> intensive; don't need to expose to public api for capacity unless for debugging

//TODO: investigate protobuf-for-nde module for serializing individual objects

window.localStorage = {


}


In case of failure, do we want to do anything? --> very unlikely that it will happen that often provided it checks capacity first

```javascript

Examples

var cache = new CacheManager(opts, storageSpace)

opts would contain a name and a debug flag that will console.log every

var article = {_id: 123, id: 123, name: 'Do it yourself', category: 'Tips'}

cache.setItem(article) //only returns an error in case of failure

cache.getItem(article)

```
* use Asana's subtasks to keep track of all individualized use cases -- easier to get a test script and to get it running quickly
* mocha test -- tests defines use cases

Example of Use Cases
reading an expired item
reached capacity
think about use cases --> will define what helper methods are needed

* Object.defineProperty() ; can set custom getting and setters on an object; for capacity exception

Steps
1. Get something that runs --> create all the classes with public API methods w/ comments --> call methods that won't do anything

2. Start with cacheManager, pick a use case, keep following all the steps down into the classes; tests as you go --> write other classes
-- start w/ one use case; setting, just focus on setting, then move to capacity

3. Create mock
 --test in node test.js creates an instance of cacheManager and pass in a fake window.localStorage object

4. Node testing

5. Browser testing
