(function (window) {
	'use strict';

	/**
	 * Creates a new model with its storage.
	 *
	 */
	function Model(storage) {
		this.storage = storage;
	}

	/**
	 * Creates a new item consisting of a description and an picture
	 */
	Model.prototype.create = function (description, picture, cb) {
		cb = cb || function () {};
		var item = {
			description: description,
			picture: picture
		};
		this.storage.save(item, cb);
	};

	/**
	 * Finds and returns a model in storage. query {string|number|object}
	 */
	Model.prototype.get = function (query, cb) {
		cb = cb || function () {};

		var qType = typeof query;
		if (qType === 'function') {
			cb = query;
			return this.storage.findAll(cb);
		} else if (qType === 'string' || qType === 'number') {
			query = parseInt(query, 10);
			this.storage.find({ id: query }, cb);
		} else {
			this.storage.find(query, cb);
		}
	};

	/**
	 * Save a model by giving it an ID, data and callback
	 *
	 */
	Model.prototype.save = function (id, data, cb) {
		this.storage.save(data, cb, id);
	};

	/**
	 * deletes a model from storage
	 *
	 */
	Model.prototype.delete = function (id, cb) {
		this.storage.delete(id, cb);
	};

	/**
	 * Sorts a model from storage
	 */
	Model.prototype.sort = function (newIndex, oldIndex) {
		this.storage.sort(newIndex, oldIndex);
	};

	/**
	 * Returns a count of all items
	 */
	Model.prototype.countAll = function (cb) {
		var total;

		this.storage.findAll(function (data) {
			total = data.length;
			cb(total);
		});
	};

	// Export to window
	window.app = window.app || {};
	window.app.Model = Model;
})(window);
