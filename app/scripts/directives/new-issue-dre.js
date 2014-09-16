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
			templateUrl:'views/partials/new-issue.html',
			scope:{
				message:'='
			},
			link:function($scope,el){
				$scope.issueTypes = [
					{key:'172',name:gettextCatalog.getString('Vandalism')},
					{key:'246',name:gettextCatalog.getString('Sanitation violation')},
					{key:'176',name:gettextCatalog.getString('Graffiti removal')},
					{key:'171',name:gettextCatalog.getString('Potholes')},
					{key:'198',name:gettextCatalog.getString('Traffic signs')},
					{key:'199',name:gettextCatalog.getString('Info signs')},
					{key:'174',name:gettextCatalog.getString('Parks')},
					{key:'211',name:gettextCatalog.getString('Playgrounds and sports parks')},
					{key:'234',name:gettextCatalog.getString('Forests')},
					{key:'180',name:gettextCatalog.getString('Other issue to be fixed')}
				];
			}
		}
	}

	angular.module('nearhoodApp').directive('newIssue',['gettextCatalog', Directive]);
})();