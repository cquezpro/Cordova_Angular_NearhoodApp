/* global angular */
(function(){
	'use strict';
	function Map ($scope,CONFIG,$timeout,$state) {
		this.inited = false;
		this.popup=null;
		this.showPopup=false;
		this.pins=[];
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.$state = $state;


		this.defaults = {
			tileLayer: CONFIG.mapBaseUrl + CONFIG.mapStyle + '/{z}/{x}/{y}.png',
            boxZoom: false,
            zoom:15,
            tap:true,
            tapTolerance:30
		}
		this.center={
			lat:60.1719713,
			lng:25.043258599999945,
			zoom:15
		};
		var self = this;
		navigator.geolocation.getCurrentPosition(function(geo){
			$timeout(function(){
				self.center.lat = geo.coords.latitude;
				self.center.lng = geo.coords.longitude;
			});
		});
		$scope.$on('leafletDirectiveMarker.click',function(e,param){
			self.clickPin(param.leafletEvent);
		});
	}
	Map.prototype.init = function(){
		if(!this.inited){
			this.inited=true;
			this.updatePins();
		}
	}
	Map.prototype.updatePins = function(){
		this.pins=[];
		var self=this;
		for(var i=0;i<this.$scope.messages.all.length;i++){
			if(self.$scope.messages.all[i].hasOwnProperty('lat')){
				self.pins.push({
					lat:self.$scope.messages.all[i].lat,
					lng:self.$scope.messages.all[i].lng,
					group:'messages.coords',
					
					icon:{
						type:'div',
						iconSize:[36,36],
						iconAnchor:[18,18],
						className:'event-group '+self.$scope.messages.all[i].type+' id-'+self.$scope.$parent.messages.all[i].id,//ugly shortcut, but I have no idea how to pass data properly :/
						html:'<i class="icon-type"></i>'
					}
				});
			}
		}
	};

	Map.prototype.clickPin = function(leafletEvent){
		//get id from class list :/
		var classList = leafletEvent.target._icon.classList,
			id;
		for(var i=0;i<classList.length;i++){
			if(classList[i].indexOf('id-')!==-1){
				id = classList[i].substr(3);
				break;
			}
		}
		this.center.lat = leafletEvent.latlng.lat;
		this.center.lng = leafletEvent.latlng.lng;
		this.popup = this.$scope.messages.all[_.findIndex(this.$scope.messages.all,{id:id})];
		this.showPopup=true;
	};

	Map.prototype.expandPopup = function(){
		this.showPopup=false;
		this.$state.go('messages.view',{id:this.popup.id});
	}
	Map.$inject = ['$scope','CONFIG','$timeout','$state'];
	angular.module('nearhoodApp').controller('nhMapCtrl',Map);
})();