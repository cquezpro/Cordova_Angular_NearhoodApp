/* global angular */
(function(){
	function Ctrl ($scope) {
		this.$scope = $scope;
		
	};


	function Directive (gettextCatalog) {
		return {
			restrict:'E',
			controller:['$scope',Ctrl],
			controllerAs:'ctrl',
			templateUrl:'views/partials/new-classified.html',
			scope:{
				message:'='
			},
			link:function($scope,el){
				$scope.classifiedTypes = [
					{key:'sell',name:gettextCatalog.getString('Sell')},
					{key:'buy',name:gettextCatalog.getString('Buy')},
					{key:'swap',name:gettextCatalog.getString('Swap')},
					{key:'give',name:gettextCatalog.getString('Give')},
					{key:'lostfound',name:gettextCatalog.getString('Lost & Found')},
					{key:'neighbourhelp',name:gettextCatalog.getString('Neighbour help')},
					{key:'jobs',name:gettextCatalog.getString('Jobs')},
					{key:'services',name:gettextCatalog.getString('Non-commercial services')},
					{key:'other',name:gettextCatalog.getString('Other')}
				];
				$scope.classifiedTtls = [
					{key:'+1 week', name:gettextCatalog.getString('Expires in a week')},
					{key:'+1 month', name:gettextCatalog.getString('Expires in a month')},
					{key:'+3 months', name:gettextCatalog.getString('Expires in three months')}
				];
			}
		}
	}

	angular.module('nearhoodApp').directive('newClassified',['gettextCatalog',Directive]);
})();