(function (window) {
	'use strict';

	/**
	 * Creates a client side storage object.
	 *
	 */
	function Storage(name, cb) {
		cb = cb || function () {};

		this._db = name;

		if (!localStorage[name]) {
			var list = {
				items: []
			};

			localStorage[name] = JSON.stringify(list);
		}

		cb.call(this, JSON.parse(localStorage[name]));
	}

	/**
	 * Finds items based on a query
	 *
	 */
	Storage.prototype.find = function (query, cb) {
		if (!cb) {
			return;
		}

		var items = JSON.parse(localStorage[this._db]).items;

		cb.call(this, items.filter(function (item) {
			for (var q in query) {
				if (query[q] !== item[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	/**
	 * Recovers all data in storage
	 */
	Storage.prototype.findAll = function (cb) {
		cb = cb || function () {};
		cb.call(this, JSON.parse(localStorage[this._db]).items);
	};

	/**
	 * Save the list to the storage
	 */
	Storage.prototype.save = function (item, cb, id) {
		var list = JSON.parse(localStorage[this._db]);
		var items = list.items;

		cb = cb || function () {};

		// find the item and update
		if (id) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].id === id) {
					for (var key in item) {
						items[i][key] = item[key];
					}
					break;
				}
			}

			localStorage[this._db] = JSON.stringify(list);
			cb.call(this, items);
		} else {
			// generate an id
			item.id = new Date().getTime();

			items.push(item);
			localStorage[this._db] = JSON.stringify(list);
			cb.call(this, [item]);
		}
	};

	/**
	 * Delete an item from the storage
	 *
	 */
	Storage.prototype.delete = function (id, cb) {
		var list = JSON.parse(localStorage[this._db]);
		var items = list.items;

		for (var i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				items.splice(i, 1);
				break;
			}
		}

		localStorage[this._db] = JSON.stringify(list);
		cb.call(this, items);
	};

	/**
	 *  Sort items from the storage by indexes
	 */
	Storage.prototype.sort = function (newIndex, oldIndex, cb) {
		cb = cb || function () {};
		var list = JSON.parse(localStorage[this._db]);
		var items = list.items;
		if (newIndex >= items.length) {
	        var k = newIndex - items.length;
	        while ((k--) + 1) {
	            items.push(undefined);
	        }
    	}
    	items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
		localStorage[this._db] = JSON.stringify(list);
		cb.call(this, list.items);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Storage = Storage;

})(window);