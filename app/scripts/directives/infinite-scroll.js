/* global angular */
(function(){
	'use strict';
	angular.module('nearhoodApp')
	.directive('nhInfiniteScroll',
		['$timeout',
		function($timeout){
			return{
				restrict:'A',
				link: function($scope,el,attr){
					el.on('scroll',function(e){
						$scope.$broadcast('scrollMessages',e,el);
						$scope.$emit('scrollMessages',e,el);
						if(el[0].clientHeight+el[0].scrollTop>=el[0].scrollHeight){
							$scope.$apply(attr.nhInfiniteScroll);
						}
					});
					$scope.$on('loadedMessages',function(){
						$timeout(function(){
							//trigger scroll
							el[0].scrollTop=el[0].scrollTop+1;
						});
					});
				}
			};
		}
	]);
})();