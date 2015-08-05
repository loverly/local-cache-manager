var LocalStorage = function LocalStorage() {
  this.storage = {};
};

// mocks localStorage public API setItem()
LocalStorage.prototype.setItem = function setItem(key, value) {
  this.storage[key] = value;
};

// mocks localStorage public API getItem()
LocalStorage.prototype.getItem = function getItem(key) {
  return this.storage[key];
};

// mocks localStorage public API removeItem()
LocalStorage.prototype.removeItem = function removeItem(key) {
  delete this.storage[key];
};

