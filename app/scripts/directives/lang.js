/* global angular */
'use strict';
(function(){
	angular.module('nearhoodApp')
	.directive('chooseLanguage',
		['language', 
		function(language){
			return{
				restrict:'E',
				templateUrl:'views/partials/choose-language.html',
				link: function($scope,el){
					$scope.languages = language.state.options;
					$scope.currentLanguage = language.state.currentLanguage;
					$scope.changeLanguage = function (newLanguage) {
						language.changeLanguage(newLanguage);
						window.location.reload();
					};
				}
			}
		}
	]);
})();