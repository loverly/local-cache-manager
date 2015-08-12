var LocalStorage = function LocalStorage() {
  this.localStorage = {};
};

// mocks localStorage public API setItem()
LocalStorage.prototype.setItem = function setItem(key, value) {
  this.localStorage[key] = value;
};

// mocks localStorage public API getItem()
LocalStorage.prototype.getItem = function getItem(key) {
  return this.localStorage[key];
};

// mocks localStorage public API removeItem()
LocalStorage.prototype.removeItem = function removeItem(key) {
  delete this.localStorage[key];
};

module.exports = LocalStorage;