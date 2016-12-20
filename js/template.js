(function (window) {
	'use strict';

	/**
	 * Help the view layer with templates
	 */
	function Template() {
		this.template_item
		=	'<li data-id="{{id}}">'
		+			'<span class="drag-handle">☰</span>'
		+			'<img width="40" height="40" src="pictures/{{picture}}"/>'
		+			'<label>{{description}}</label>'
		+			'<button class="edit"></button>'
		+			'<button class="destroy"></button>'
		+	'</li>';

		this.template_form_new_item
		=	'<p><strong>New Item</strong></p>'
        +	'<input class="basicModal__text" type="text" placeholder="description" name="description" value={{description}}>'
        +	'<p class="help">Max. 300 characters </p>'
        +	'<input class="basicModal__text" type="file" placeholder="description" name="picture" />'
        +	'<p class="help">File Types: jpg, gif, png. Dimensions: 320px x 320px </p>';

        this.template_form_edit_item
		=	'<p><strong>Edit Item</strong></p>'
        +	'<input class="basicModal__text" type="text" placeholder="description" name="description" value={{description}}>'
        +	'<p class="help">Max. 300 characters </p>'
        +	'<img class="preview-picture" width="40" height="40" src="pictures/{{picture}}"/>'
        +	'<input class="basicModal__text" type="file" placeholder="description" name="picture" />'
        +	'<input type="hidden" name="_picture" value="{{picture}}"/>'
        +	'<p class="help">File Types: jpg, gif, png. Dimensions: 320px x 320px </p>';

	}

	/**
	 * Show the template item based on your data
	 */
	Template.prototype.show = function (data) {
		var i, l;
		var view = '';
		for (i = 0, l = data.length; i < l; i++) {
			var template = this.template_item;

			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{description}}', data[i].description);
			template = template.replace('{{picture}}', data[i].picture);

			view = view + template;
		}

		return view;
	};

	/**
	 * Show the template form new item based on your data
	 */
	Template.prototype.showForm = function () {
		
		var template = this.template_form_new_item;
		template = template.replace('{{description}}', '');
		return template;
	};

	/**
	 * Show the template form edit item based on your data
	 */
	Template.prototype.showEditForm = function (data) {
		
		var template = this.template_form_edit_item;
		template = template.replace('{{description}}', data.description);
		template = template.replace(new RegExp('{{picture}}', 'g'), data.picture);

		return template;
	};

	/**
	 * Show the template counter based on total items
	 */
	Template.prototype.counter = function (total) {
		var pl = total === 1 ? '' : 's';
		return '<strong>' + total + '</strong> item' + pl;
	};


	// Export to window
	window.app = window.app || {};
	window.app.Template = Template;
})(window);