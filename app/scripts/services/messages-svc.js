'use strict';

angular.module('nearhoodApp')
	.factory('messages', [function() {
		
		// Public API here
		return {
			setOpened: function(message){
				this.state.opened = message;
			},
			getOpened: function(){
				return this.state.opened;
			}
		};
	}]);
