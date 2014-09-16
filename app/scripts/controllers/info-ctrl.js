/* global angular */
'use strict';

(function(){
	function Info ($scope,CONFIG) {
		this.$scope = $scope;
		this.$scope.CONFIG = CONFIG;

	}
	Info.$inject = ['$scope','CONFIG'];
	angular.module('nearhoodApp').controller('nhInfoCtrl', Info);
})();