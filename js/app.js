(function () {
	'use strict';

	/**
	 * Single page application, SPA, that displays a list of items.
	 * The solution is designed by a pattern of layers and mvc.
	 */
	function SpaList(name) {
		this.storage = new app.Storage(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	var spaList = new SpaList('spa-list');

	window.addEventListener('load', function(){
		spaList.controller.initView();
	});

	window.addEventListener('hashchange', function(){
		spaList.controller.initView();
	});

})();