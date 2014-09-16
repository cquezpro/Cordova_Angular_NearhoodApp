/* global angular,_,Hammer */
'use strict';
(function(){
	angular.module('nearhoodApp')
	.directive('newMessageTypeSwiper',
		['$stateParams', '$timeout', 'UIService',
		function($stateParams, $timeout, UIService){
			return{
				link: function($scope,el){
					$scope.margin = (UIService.state.winWidth-290)/2;
					var curtype = $stateParams.newtype;
					if(curtype==='all'){
						curtype='update';
					}
					$scope.types = ['update','pick','photopick','classified','event','issue'];
					//populate with 5 types to start with; start from the current and add 2 on each side
					var curindex = arrIndex($scope.types,curtype);
					$scope.typeStack = [{
						pos:0,
						type:curtype
					}];
					//push 3 before & 3 after
					for(var i=1;i<5;i++){
						$scope.typeStack.push({
							pos:i,
							type:getType(curindex+i)
						});
						$scope.typeStack.push({
							pos:-i,
							type:getType(curindex-i)
						});
					}

					$scope.getTypeAt = function(){
						var at = $scope.horizonPos;
						if(at!==0){
							at = -at;
						}
						return $scope.typeStack[_.findIndex($scope.typeStack,{pos:at})];
					}

					$scope.horizonPos=0;
					$scope.navtype = function(where){
						//where is eval(1,-1)
						if(where>0){
							$scope.horizonPos+=1;
						}
						else {
							$scope.horizonPos-=1;
						}
						// $scope.horizonPos += where;
						$timeout(function(){
							if(where<0){
								//add at highestPos()
								$scope.typeStack.push({
									pos:highestPos()+1,
									type:getType(curindex+highestPos()+1)
								});
								//remove at lowestPos()
								$scope.typeStack.splice(
									_.findIndex($scope.typeStack,{pos:lowestPos()}),1
								);
							}
							else {
								//add at lowestPos()
								$scope.typeStack.push({
									pos:lowestPos()-1,
									type:getType(curindex+(lowestPos()-1))
								});
								//remove at highestPos()
								$scope.typeStack.splice(
									_.findIndex($scope.typeStack,{pos:highestPos()}),1
								);
							}
						},400);
					};
					$scope.goTo = function(type){
						var curtype = getType(curindex-$scope.horizonPos);
						var fromIndex = arrIndex($scope.types,curtype);
						var gotoIndex = arrIndex($scope.types,type);

						var diff = fromIndex-gotoIndex;
						for(var i=0;i<Math.abs(diff);i++){
							$scope.navtype(diff);
						}
					}

					function highestPos () {
						var highpos = -9999999999;
						for(var i=0;i<$scope.typeStack.length;i++){
							if($scope.typeStack[i].pos>highpos){
								highpos=$scope.typeStack[i].pos;
							}
						}
						return highpos;
					}
					function lowestPos () {
						var lowpos = 9999999999;
						for(var i=0;i<$scope.typeStack.length;i++){
							if($scope.typeStack[i].pos<lowpos){
								lowpos=$scope.typeStack[i].pos;
							}
						}
						return lowpos;
					}
					function getType (index) {
						if(index<$scope.types.length && index>=0){
							return $scope.types[index];
						}
						if(index<0){
							index = Math.abs(index);
							if(index>=$scope.types.length){
								index = index%$scope.types.length;
							}
							index = $scope.types.length-index;
							if(index===$scope.types.length){
								index=0;
							}
						}
						else {
							index = index%$scope.types.length;
						}
						return $scope.types[index];
					}

					new Hammer(el[0]).on('drag swipe',function(e){
						if(Hammer.utils.isVertical(e.gesture.direction)) {
							return;
						}
						e.gesture.preventDefault();
						if(e.type==='swipe'){
							if(e.gesture.direction==='left'){
								$scope.$apply(function(){
									$scope.navtype(-1);
								});
							}
							else if(e.gesture.direction==='right'){
								$scope.$apply(function(){
									$scope.navtype(1);
								});
							}
						}
					});

					function arrIndex (arr,str) {
						var index = -1;
						for(var i=0;i<arr.length;i++){
							if(arr[i]===str){
								index=i;
								break;
							}
						}
						return index;
					}
				}
			};
		}
	]);
})();