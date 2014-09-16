/* global angular,Hammer */
(function(){
	'use strict';
	angular.module('nearhoodApp')
	.directive('swipeForMenu',['menu', function(Menu){
			return{
				link: function($scope,el){

					new Hammer(el[0]).on('swipe',function(e){
						

						e.preventDefault();
						if(e.type==='swipe'){
							if(e.direction===2){
								if(Menu.state.visible){
									$scope.$apply(function(){
										Menu.state.visible=false;
									});
								}
							}
							else if(e.direction===4){
								if(!Menu.state.visible){
									$scope.$apply(function(){
										Menu.state.visible = true;
									});
								}
							}
						}
					});
				}
			};
		}
	]);
})();