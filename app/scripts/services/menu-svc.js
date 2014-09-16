'use strict';

angular.module('nearhoodApp')
	.factory('menu', [function() {

		var state = {
			visible:false,
			top:true,
			view:''
		};

		// Public API here
		return {
		
			state: state,
	
			toggle: function () {
				if (this.state.visible === false) {
					this.state.visible = true;
				} else {
					this.state.visible = false;
				}
				return this.state;
			}
				
		};
	}]);
