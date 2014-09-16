'use strict';

angular.module('nearhoodApp')
	.factory('welcome', ['localStorageService', function(storage) {

		var welcomeShownState = storage.get('welcomeShown'); // get saved data from localStorage

		// Public API here
		return {
			state: {
				welcomeShown: welcomeShownState,
				districtChosen: false,
			},
			
			markWelcomeShown: function () {
				storage.set('welcomeShown',true); //save to localStorage
				this.state.welcomeShown = true;
			}
		};
	}]);
