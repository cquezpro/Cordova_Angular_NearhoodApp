/* global angular, Hammer */
'use strict';
(function(){
	angular.module('nearhoodApp')
	.directive('sideview',
		['$state','UIService',
		function($state,UIService){
			return{
				link: function($scope,el){
					$scope.stateLevel = stateLevel($state.current);
					$scope.$on('$stateChangeStart', function(event, toState){
						$scope.stateLevel = stateLevel(toState);
					});
					$scope.ui = UIService.state;
					
					//swipe right to close	
					new Hammer(el[0]).on('drag swipe',function(e){
						//prevent behavor if at new-message view
						if($state.current.name!=='messages.new'){
							if(Hammer.utils.isVertical(e.gesture.direction)) {
								return;
							}
							e.gesture.preventDefault();
							if(e.type==='swipe'){
								if(e.gesture.direction==='right'){
									$scope.$apply(function(){
										$scope.closeSideview();
									});
								}
							}
						}
					});
					

					$scope.closeSideview = function(e,params){
						// $scope.stateLevel--;
						// if(!params){
						// 	params={redirect:true};
						// }
						// if(params.redirect){
						// 	setTimeout(function(){
						// 		window.history.go(UIService.state.backStep);
						// 		UIService.state.backStep=-1;
						// 	},350);
						// }
						var statear = $state.current.name.split('.');
						statear.pop();
						$state.go(statear.join('.'));
					};
					
					$scope.$on('closeSideview',$scope.closeSideview);
				}
			};
		}
	])
	.directive('sideviewsub',
		['$state','UIService',
		function($state,UIService){
			return{
				link: function($scope,el){
					$scope.show=false;
					$scope.stateLevel = stateLevel($state.current);

					$scope.$on('$stateChangeStart',
						function(event, toState){
							$scope.stateLevel = stateLevel(toState);
						}
					);
					
					//swipe right to close	
					new Hammer(el[0]).on('drag swipe',function(e){
						if(Hammer.utils.isVertical(e.gesture.direction)) {
							return;
						}
						e.gesture.preventDefault();
						if(e.type==='swipe'){
							if(e.gesture.direction==='right'){
								$scope.$apply(function(){
									$scope.closeSideview();
								});
							}
						}
					});
					

					$scope.closeSideview = function(e,params){
						if(e){
							e.stopPropagation();
						}
						$scope.stateLevel--;
						$scope.$parent.stateLevel--;//this is bad but no more time for it

						if(!params){
							params={redirect:true};
						}
						if(params.redirect){
							setTimeout(function(){
								window.history.go(UIService.state.backStep);
								UIService.state.backStep=-1;
							},350);
						}
					};
					
					$scope.$on('closeSideview',$scope.closeSideview);
				}
			};
		}
	]);

	function stateLevel (state) {
		var name = state.name;
		var level=0;
		while(name.indexOf('.')!==-1){
			name = name.substr(name.indexOf('.')+1);
			level++;
		}
		return level;
	}
})();