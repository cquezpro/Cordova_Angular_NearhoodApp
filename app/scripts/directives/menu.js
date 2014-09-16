/* global angular,Hammer */
'use strict';

(function(){
	angular.module('nearhoodApp')
	.directive('mainMenu',['menu', 'user', '$stateParams','$timeout','$state', 'District', 'gettext','gettextCatalog', function(Menu, User, $stateParams,$timeout,$state,district, gettext, gettextCatalog){
		return {
			restrict:'E',
			replace:true,
			templateUrl:'views/partials/menu.html',
			link:function($scope,el,attr){
				$scope.items = [
					{
						type:'all',
						name:gettextCatalog.getString('Latest')
					},
					{
						type:'highlight',
						name:gettextCatalog.getString('Highlights')
					},
					{
						type:'sanom',
						name:gettextCatalog.getString('Updates')
					},
					{
						type:'pick',
						name:gettextCatalog.getString('Picks')
					},
					{
						type:'classified',
						name:gettextCatalog.getString('Classifieds')
					},
					{
						type:'event',
						name:gettextCatalog.getString('Events')
					},
					{
						type:'issue',
						name:gettextCatalog.getString('Issues')
					}
				];
				$scope.menu = Menu.state;
				User.get().then(function(){
					$scope.user = User.data;
				});
				$scope.params = $stateParams;
				$scope.inSideview=false;
				$scope.district = district;
				$scope.state = $state;
				
				if($state.current.name.indexOf('.')!==-1){
					$scope.inSideview=true;
				}

				$scope.usera = User.get();
				
				$scope.toggle = function(){
					Menu.toggle();
				};

				document.addEventListener("menubutton", function(e){
					e.preventDefault();
					$timeout(function(){
						$scope.toggle();
					});
				}, false);

				$scope.liPos = function($index){
					var x = -20,
						y = $index*46;
					if($scope.items[$index]){
						if($scope.items[$index].type===$scope.params.type && !Menu.state.visible){
							x=-10;
						}
					}
					
					return {
						'-webkit-transform':'translate('+x+'px,'+y+'px)'
					};
				};

				$scope.$on('$stateChangeStart',function(){
					//close the menu
					if(Menu.state.visible){
						Menu.toggle();
					}
					
				});
				$scope.$on('$stateChangeSuccess',function(){
					if($state.current.name.indexOf('.')!==-1){
						$scope.inSideview=true;
					}
					else {
						$scope.inSideview=false;
					}
				});

				new Hammer(el[0]).on('swipeleft',function(){
					if(!Menu.state.visible){
						$scope.$apply(function(){
							Menu.toggle();
						})
					}
				});
				new Hammer(el[0]).on('swiperight',function(){
					if(Menu.state.visible){
						$scope.$apply(function(){
							Menu.toggle();
						});
					}
				});
				
				$scope.isLoggedIn = function () {
					return User.isLoggedIn();
				};

				$scope.userImg = function () {
					return User.userImg();
				};

				var lastScrollY = 0;
				$scope.showToggle=true;
				$scope.$on('scrollMessages',function(e2,e){
					if(e.target.scrollTop > lastScrollY && e.target.scrollTop>1){
						$timeout(function(){
							$scope.showToggle=false;
						});
					}
					else {
						$timeout(function(){
							$scope.showToggle=true;
						});
					}
					lastScrollY = e.target.scrollTop;
				});
			}
		}
	}]);
})();