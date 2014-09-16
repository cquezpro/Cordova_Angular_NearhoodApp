/* global angular */
(function(){
	function locationBlock (CONFIG) {
		return {
			restrict:'E',
			scope:{
				messagedata:'=',
				hide:'='
			},
			templateUrl:'views/partials/location-block.html',
			link:function($scope, el, attrs){
				$scope.isAndroid40=false;
				
			},
			controller:['$scope',function($scope){
				$scope.mapDefaults = {
					tileLayer: CONFIG.mapBaseUrl + CONFIG.mapStyle + '/{z}/{x}/{y}.png',
		            maxZoom: 19,
		            dragging: false,
		            touchZoom: false,
		            doubleClickZoom: false,
		            boxZoom: false,
		            tap: false,
		            zoomControl:false
				}
				$scope.mapCenter = {lat: 60.1733244, lng: 24.9410248, zoom:15};
				$scope.mapMarkers ={ 
					pin: {
						lat: 60.1733244,
						lng: 24.9410248,
						focus:true,
						draggable:false
					}
				};
				$scope.$on('locationDoneEcho',function(){
					$scope.mapCenter.lat = $scope.messagedata.lat;
					$scope.mapCenter.lng = $scope.messagedata.lng;
					$scope.mapMarkers.pin.lat = $scope.messagedata.lat;
					$scope.mapMarkers.pin.lng = $scope.messagedata.lng;
				})
				$scope.chooseLocation = function(){
					$scope.$emit('chooseLocation');
				}
				$scope.removeLocation = function(){
					$scope.messagedata.lat = -1;
					$scope.messagedata.lng = -1;
					$scope.messagedata.address = '';
					$scope.messagedata.poi=null;
				}
			}]
		}
	}
	angular.module('nearhoodApp').directive('locationBlock',['CONFIG',locationBlock]);
})();