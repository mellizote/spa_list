(function (window) {
	'use strict';

	/**
	 * Creates a view layer with its template.   
	 */
	function View(template) {
		this.template = template;
		this.$spaList = document.querySelector('.spa-list');
		this.$counter = document.querySelector('.spa-list-count');
		this.$newItem = document.querySelector('.new-item');
	}

	/**
	 * Get the id based on the data-id attribute  
	 */
	View.prototype._getElementId = function (el) {
		var getParent = function (el, tagName) {
			if (!el.parentNode) { return; }
			if (el.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) { return el.parentNode;}
			return getParent(el.parentNode, tagName);
		};
		var li = getParent(el, 'li');
		return parseInt(li.dataset.id, 10);
	};

	var _validateImage = function (file, dimensions) {	
		var valid_type = file.type == "image/png" || file.type == "image/gif"  || file.type == "image/jpeg";
        var valid_dimensions = dimensions.width == 320 && dimensions.height == 320;
        if (valid_type && valid_dimensions){
        	return true;
        }
        return false;
	};

	View.prototype._uploadImage = function () {
		var self = this;
		var file = document.querySelector('[name="picture"]').files[0];

		if(file){
	        var img = new Image();
	        img.onload = function () {
	        	var dimensions = {width: this.width, 'height': this.height};
	        	if (_validateImage(file,dimensions)){
	        		var data = new FormData();
	    			data.append('picture',file);
			       	var request = new XMLHttpRequest();
				    request.onreadystatechange = function(){
				        if(request.readyState == 4){
				            try {
				                var resp = JSON.parse(request.response);
				                var preview = document.querySelector('.preview-picture');
				                if (preview){
				                	preview.setAttribute('src', 'pictures/' + file.name);	
				                }

				            } catch (e){
				                var resp = {
				                    status: 'error',
				                    data: 'Unknown error occurred: [' + request.responseText + ']'
				                };
				                document.querySelector('[name="picture"]').value = '';
				                basicModal.error('picture');
				            }
				            //console.log(resp.status + ': ' + resp.data);
				        }
				    };
			       	request.open('POST', 'upload.php');
	    			request.send(data);		
	        	}
	        	else{
				    document.querySelector('[name="picture"]').value = '';
	        		basicModal.error('picture');
	        	}
	        };
	        img.onerror = function(){
    			document.querySelector('[name="picture"]').value = '';
	        	basicModal.error('picture');
			}
	        var _URL = window.URL || window.webkitURL;
	        img.src = _URL.createObjectURL(file);
	    }
	    else{
	    	document.querySelector('[name="picture"]').value = '';
	    	basicModal.error('picture');
	    }
	};

	View.prototype._newItem = function () {
		var self = this;

		var validate = function(data) {
			data.description = data.description.trim();
			if (data.description.length > 300 || !data.description.length) {
				// Invalid item description max 300 characters
        		basicModal.error('description')
        		return false;
			}
			if (!data.picture.length) {
				// Invalid item not picture
        		basicModal.error('picture')
        		return false;
			}

			// item valid
			// create the custom event
			var customEvent = new CustomEvent("finishNewForm", {
				detail: {
					item: data
				}
			});
			// trigger custom event
			document.dispatchEvent(customEvent);
    		basicModal.close();
    		return true
    	};

    	var callback = function(){
    		document.querySelector('[name="picture"]').addEventListener("change",self._uploadImage);
    	}
    	


		basicModal.show({
		    body: self.template.showForm(),
		    class: basicModal.THEME.small,
		    closable: true,
		    callback: callback,
		    buttons: {
		    	cancel: {
            		class: basicModal.THEME.xclose,
            		fn: basicModal.close
        		},
		        action: {
            		title: 'Add Item',
            		fn: validate
        		}
		    }
		})
	};

	View.prototype._editItem = function (item) {
		var self = this;

		var validate = function(data) {
			data.id = item.id;
			data.description = data.description.trim();
			if (item.description.length > 300 || !item.description.length) {
				// Invalid item description max 300 characters
        		basicModal.error('description')
        		return false;
			}
			if (!data.picture.length) {
				// Invalid item not picture
        		data.picture = item.picture; 
			}

			// item valid
			// create the custom event
			var customEvent = new CustomEvent("finishEditForm", {
				detail: {
					item: data
				}
			});
			// trigger custom event
			document.dispatchEvent(customEvent);
    		basicModal.close();
    		return true
    	};

		var callback = function(){
    		document.querySelector('[name="picture"]').addEventListener("change",self._uploadImage);
    	}


		basicModal.show({
		    body: self.template.showEditForm(item),
		    class: basicModal.THEME.small,
		    closable: true,
		    callback: callback,
		    buttons: {
		    	cancel: {
            		class: basicModal.THEME.xclose,
            		fn: basicModal.close
        		},
		        action: {
            		title: 'Edit Item',
            		fn: validate
        		}
		    }
		})
	};

	View.prototype._editItemDone = function (id, description, picture) {
		var listItem = document.querySelector('[data-id="' + id + '"]');
		[].forEach.call(listItem.querySelectorAll('label'), function(label) {
		  label.textContent = description;
		});

		[].forEach.call(listItem.querySelectorAll('img'), function(img) {
		  img.setAttribute('src', 'pictures/' + picture);
		});
	};

	View.prototype._removeItem = function (id) {
		var elem = document.querySelector('[data-id="' + id + '"]');

		if (elem) {
			this.$spaList.removeChild(elem);
		}
	};

	View.prototype._sortItem = function () {
		Sortable.create(this.$spaList, {
			handle: '.drag-handle',
			onEnd: function (event) {
        		// create the custom event
				var customEvent = new CustomEvent("finishSortItem", {
					detail: {
						indexes: { newIndex: event.newIndex, oldIndex: event.oldIndex}
					}
				});
				// trigger custom event
				document.dispatchEvent(customEvent);
    		},

		});
	};

	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			newItem: function () {
				self._newItem();
			},
			editItem: function () {
				self._editItem(parameter);
			},
			editItemDone: function () {
				self._editItemDone(parameter.id, parameter.description, parameter.picture);
			},
			removeItem: function () {
				self._removeItem(parameter);
			},
			sortItem: function () {
				self._sortItem();
			},
			updateCounter: function () {
				self.$counter.innerHTML = self.template.counter(parameter);
			},
			showItems: function () {
				self.$spaList.innerHTML = self.template.show(parameter);
			}
		};

		viewCommands[viewCmd]();
	};

	View.prototype._bindEventNewDone = function (hdlr) {
		document.addEventListener('finishNewForm', function(customEvent){
    		var item = customEvent.detail.item;
    		hdlr(item);
		});
	};

	View.prototype._bindEventEditDone = function (hdlr) {
		var self = this;
		document.addEventListener('finishEditForm', function(customEvent){
    		var item = customEvent.detail.item;
    		hdlr(item);
		});
	};

	View.prototype._bindEventSortDone = function (hdlr) {
		document.addEventListener('finishSortItem', function(customEvent){
    		var indexes = customEvent.detail.indexes;
    		hdlr(indexes);
		});
	};

	View.prototype.bind = function (event, hdlr) {
		var self = this;
		if (event === 'event_new') {
			self.$newItem.addEventListener('click', function () {
				hdlr();
			});
		} else if (event === 'event_new_done') {
			self._bindEventNewDone(hdlr);	
		} else if (event === 'event_edit') {	
			var dispatchEvent = function(event) {
				var targetElement = event.target;
				var elements = self.$spaList.querySelectorAll('.edit');
				var hasMatch = Array.prototype.indexOf.call(elements, targetElement) >= 0;

				if (hasMatch) {
					hdlr({id: self._getElementId(targetElement)});
				}
			}
			self.$spaList.addEventListener('click', dispatchEvent);
		} else if (event === 'event_edit_done') {
			self._bindEventEditDone(hdlr);
		} else if (event === 'event_remove') {
			var dispatchEvent = function(event) {
				var targetElement = event.target;
				var elements = self.$spaList.querySelectorAll('.destroy');
				var hasMatch = Array.prototype.indexOf.call(elements, targetElement) >= 0;

				if (hasMatch) {
					hdlr({id: self._getElementId(targetElement)});
				}
			}

			self.$spaList.addEventListener('click', dispatchEvent);
		} else if (event === 'event_sort') {
			hdlr();
		} else if (event === 'event_sort_done') {
			self._bindEventSortDone(hdlr);	
		} 
	};

	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));
