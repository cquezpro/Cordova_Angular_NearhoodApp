/* global angular */
(function(){
	'use strict';
	angular.module('nearhoodApp')
	.directive('notify',
		['$timeout',
		function($timeout){
			return{
				restrict:'E',
				replace:true,
				template:'<div class="feedback {{data.class}}" ng-show="show"><div><i class="{{data.icon}}"></i><span class="text">{{data.message}}</span></div></div>',
				link: function($scope,el){
					var defaults = {
						timeout:3000,
						icon:'icon-ok',
						class:''
					};
					$scope.$on('notify',function(e,params){
						if(typeof params==='String'){
							params = {message:params};
						}
						$scope.data = _.extend(_.clone(defaults),params);

						if(params.message.length>50){
							$scope.data.class='small';
						}
						if($scope.data.icon==='icon-remove'){
							$scope.data.class+=' error';
						}
						$scope.show=true;
						$timeout(function(){
							$scope.show=false;
						},$scope.data.timeout);
					});
				}
			}
		}
	]);
})();