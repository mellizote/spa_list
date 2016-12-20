(function (window) {
	'use strict';

	/**
	 * Creates a controller layer with its model and view.   
	 */
	function Controller(model, view) {
		var self = this;
		self.model = model;
		self.view = view;

		self.view.bind('event_new', function () {
			self.newItem();
		});

		self.view.bind('event_new_done', function (item) {
			self.newItemDone(item.description, item.picture);
		});

		self.view.bind('event_edit', function (item) {
			self.editItem(item.id);
		});

		self.view.bind('event_edit_done', function (item) {
			self.editItemDone(item.id, item.description, item.picture);
		});

		self.view.bind('event_remove', function (item) {
			self.removeItem(item.id);
		});

		self.view.bind('event_sort', function () {
			self.sortItem();
		});

		self.view.bind('event_sort_done', function (indexes) {
			self.sortItemDone(indexes.newIndex, indexes.oldIndex);
		});
	}

	/**
	 * Loads and initialises the view
	 *
	 */
	Controller.prototype.initView = function () {
		this._updateState();
	};

	/**
	 * Show all items
	 */
	Controller.prototype.showAllItems = function () {
		var self = this;
		self.model.get(function (data) {
			self.view.render('showItems', data);
		});
	};

	/*
	 * Activate the modal form new item
	 */
	Controller.prototype.newItem = function () {
		var self = this;
		self.view.render('newItem');
	};

	/**
	 * An event to fire to add an new item consisting of a description and an picture
	 */
	Controller.prototype.newItemDone = function (description,picture) {
		var self = this;

		self.model.create(description,picture, function () {
			self._refresh();
		});
	};

	/*
	 * Activate the modal form edit item
	 */
	Controller.prototype.editItem = function (id) {
		var self = this;
		self.model.get(id, function (data) {
			self.view.render('editItem', {id: id, description: data[0].description, picture: data[0].picture});
		});
	};

	/*
	 * Save a model from storage
	 */
	Controller.prototype.editItemDone = function (id, description, picture) {
		var self = this;
		description = description.trim();

		if (description.length !== 0) {
			self.model.save(id, {description: description, picture: picture}, function () {
				self.view.render('editItemDone', {id: id, description: description, picture: picture});
			});
		} else {
			self.removeItem(id);
		}
	};

	/**
	 * By giving it an ID deletes a model from storage
	 */
	Controller.prototype.removeItem = function (id) {
		var self = this;
		self.model.delete(id, function () {
			self.view.render('removeItem', id);
		});

		self._refresh();
	};

	/*
	 * Activate sort items
	 */
	Controller.prototype.sortItem = function () {
		var self = this;
		self.view.render('sortItem');
	};

	/**
	 * Sorts a model from storage
	 */
	Controller.prototype.sortItemDone = function (newIndex, oldIndex) {
		this.model.sort(newIndex, oldIndex);
	};

	/**
	 * Updates counter of items.
	 */
	Controller.prototype._updateCounter = function () {
		var self = this;
		self.model.countAll(function (total) {
			self.view.render('updateCounter', total);
		});
	};

	/**
	 * Refresh the view
	 */
	Controller.prototype._refresh = function () {
		this._updateCounter();
		this.showAllItems();
	};

	/**
	 * Update State
	 */
	Controller.prototype._updateState = function () {
		this._refresh();
	};

	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);