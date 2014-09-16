/* global angular */
(function(){
	'use strict';
	angular.module('nearhoodApp')
	.directive('newMessage',
		['$timeout','$state','user', 'UIService',
		function($timeout,$state,User, UIService){
			return{
				restrict:'A',
				link: function($scope,el){
					var lastScrollY = 0;
					$scope.showNewBtn=true;
					$scope.$on('scrollMessages',function(e2,e){
						if(lastScrollY!==e.target.scrollTop){
							if(e.target.scrollTop > lastScrollY && e.target.scrollTop>1){
								$timeout(function(){
									$scope.showNewBtn=false;
								});
							}
							else {
								$timeout(function(){
									$scope.showNewBtn=true;
								});
							}
						}
						
						lastScrollY = e.target.scrollTop;
					});
					$scope.openNewMsg = function(){
						$scope.on=true;

						if(User.isLoggedIn()){
							UIService.state.sideviewPos='bottom';
							$timeout(function(){
								$state.go('messages.new').then(function(){
									$timeout(function(){
										$scope.on=false;
										UIService.state.sideviewPos='right';
									},500);
								});
							},100);
							
						}
						else {
							User.state.afterLogin = {name:'messages.new'};
							$state.go('messages.login')
						}
						
					};
					var iosOffset = 0;
//					if(window.hasOwnProperty('StatusBar')){
//						iosOffset = 20;
//					}
					function setTop(){
						el.css({'-webkit-transform':'translate(0,'+(window.innerHeight-70-iosOffset)+'px)'});
					}
					setTop();
					angular.element(window).on('resize',setTop);
				}
			};
		}
	]);
})();