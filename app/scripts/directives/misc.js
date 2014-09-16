/* global angular, Hammer, ga_storage */
'use strict';
(function(){
	angular.module('nearhoodApp')
	.directive('goBack',
		[ 
		function(){
			return{
				link: function($scope,el){
					new Hammer(el[0]).on('tap',function(){
						window.history.back();
					});
				}
			};
		}
	])
	.directive('stopPropagation',
		[ 
		function(){
			return{
				link: function($scope,el){
					el.on('click tap touch touchstart touchend',function(e){
						e.stopPropagation();
					});
				}
			};
		}
	])
	.directive('skParent',
		[ 
		function(){
			return{
				link: function($scope,el){
					var top=0;
					$scope.skfocus = false;
					$scope.$on('skFocus', function(e,_top){
						top=_top;
						$scope.skfocus=true;
						$scope.$digest();
					});
					$scope.$on('skBlur',function(){
						top=0;
						$scope.skfocus=false;
						$scope.$digest();
					});
					angular.element(window).on('resize',function(){
						if(top>window.innerHeight){
							el[0].scrollTop= top-window.innerHeight;
						}
					});
					// var prevTop = 0;
					// $scope.bottomMargin=0;
					// $scope.$on('skFocus',function(e,top){
					// 	prevTop = el[0].scrollTop;
					// 	$scope.$apply(function(){
					// 		$scope.bottomMargin=500;
					// 	});
					// 	el[0].scrollTop=top;
						
					// });
					// $scope.$on('skBlur',function(){
					// 	el[0].scrollTop = prevTop;
					// 	$scope.$apply(function(){
					// 		$scope.bottomMargin=0;
					// 	});
					// });
				}
			};
		}
	])
	.directive('skFocusHandler',
		[ 
		function(){
			return{
				link: function($scope,el){
					el.on('focus',function(){
						$scope.$emit('skFocus',el[0].offsetTop+50);
					});
					el.on('blur',function(){
						$scope.$emit('skBlur');
					});
				}
			};
		}
	])
	.directive('skFocus',
		[ 
		function(){
			return{
				link: function($scope,el){
					el[0].focus();
					$scope.$on('focusSearch',function(){
						setTimeout(function() {
							el[0].focus();
						}, 100);
						setTimeout(function(){
							SoftKeyboard.show();
						},1000);
					})
					SoftKeyboard.show();
					setTimeout(function() {
						SoftKeyboard.show();
					}, 1000);
				}
			};
		}
	])
	.directive('comeInClass',
		['UIService', 
		function(UIService){
			return{
				link: function($scope,el,attr){
					$scope.cameIn=false;
					$scope.$on('scrollMessages', function (e,origEvent,scrollEl){
						if(!$scope.cameIn){
							if(el[0].offsetTop+100<scrollEl[0].scrollTop+UIService.state.winHeight){
								$scope.cameIn=true;
								el.addClass(attr.comeInClass);
							}
						}
					});
					
				}
			};
		}
	])
	.directive('scrolltop',
		['$timeout',
		function($timeout){
			return{
				link: function($scope,el,attr){
					el.on('scroll',function(e){
						$timeout(function(){
							$scope.scrolltop = el[0].scrollTop
						});
						$scope.$on('scrolltop', function(e,top){
							setTimeout(function() {
								el[0].scrollTop=top;
							}, 300);
						})
						
					})
					
				}
			};
		}
	])
	.directive('uiSubSref',
		['$state',
		function($state){
			return{
				link: function($scope,el,attr){
					new Hammer(el[0]).on('tap',function(){
						var state = $state.current.name;
						if(state.indexOf('.')!==-1){
							state = state.substr(0,state.indexOf('.'));
						}
						$scope.$apply(function(){
							$state.go(state+attr.uiSubSref);
						});
					});
				}
			};
		}
	])
	.directive('openExternal',
		['$state',
		function($state){
			return{
				link: function($scope,el,attr){
					$scope.openurl = function (data,ev) {
						ev.stopPropagation();
						ga_storage._trackEvent('Messages', 'openExternalUrl', data.url);
        				var redirUrl = 'https://nearhood.net/redirect?url='+encodeURIComponent(data.url)+'&id='+data._id;
						window.open(redirUrl, '_system');
					}
				}
			};
		}
	])
	.directive('validLocation', function(){
		return{
			require:'ngModel',
			link:function($scope,el,attr,ctrl){
				ctrl.$parsers.unshift(function(val){
					if (Number(val)>-1) {
						ctrl.$setValidity('location', true);
						return val;
					} else {
						ctrl.$setValidity('location', false);
						return undefined;
					}
				})
				$scope.$watch(attr.ngModel, function(viewValue) {
					if (viewValue>-1) {
						// ctrl.$setValidity('location', true);
					} else {
						// ctrl.$setValidity('lc', false);
					}
				});
			}
		}
	});

})();