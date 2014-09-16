/* global angular, SoftKeyboard */
(function(){
	function Ctrl ($scope, $timeout, Server) {
		var self = this;
		this.$timeout = $timeout;
		this.server = Server;
		this.$scope = $scope;

		this.message = $scope.message;
		this.message.newplace='';
		this.places=[];
		this.coords = {};
		this.mapCenter = {lat: 42, lng: 23, zoom:15};
		
		this.poiPin = function(icon){
			if(icon==='+'){
				var over = '<div class="over add">+</div>';
			}
			else {
				var over = '<div class="over"><img src="https://nearhood.net'+icon+'"></div>';
			}
			return {
				type:'div',
				iconSize:[33,43],
				iconAnchor:[17,43],
				className:'poi',
				html:'<img src="img/marker-poi.png">' + over
			}
		}
		this.locationPin={
			type:'div',
			iconSize:[33,43],
			iconAnchor:[17,43],
			className:'',
			html:'<img src="img/marker-location.png">'
		}
		this.mapMarkers ={ 
			pin: {
				lat: 42.6965977,
				lng: 23.3121904,
				focus:true,
				draggable:true,
				icon:this.locationPin
			}
		};
		$scope.$on('leafletDirectiveMarker.dragend',function(e,param){
			self.mapCenter.lat = param.leafletEvent.target._latlng.lat;
			self.mapCenter.lng = param.leafletEvent.target._latlng.lng;
			self.updateLocation();
			self.suggestPlaces();
		});

		$scope.$on('locationChosen', function(e,place){
			if(typeof place==='object'){
				self.message.poi = place;
				self.mapCenter.lat = place.lat;
				self.mapCenter.lng = place.lon;
				self.mapMarkers.pin.lat = place.lat;
				self.mapMarkers.pin.lng = place.lon;
				self.suggestPlaces();
			}
			else {
				//it's a plain text
				self.message.poi=null;
				self.addingNewPlace=true;
				self.message.newplace=place;
			}
			
			window.history.back();

			SoftKeyboard.hide();
		});

		this.addingNewPlace = false;

		this.chooseLocation();
	};

	Ctrl.prototype.toCurrentLocation = function(){
		var self = this;
		//temp
		
		self.$timeout(function(){
			self.message.lat = 60.194735;
			self.message.lng = 25.0326173;
			self.mapCenter.lat = self.message.lat;
			self.mapCenter.lng = self.message.lng;
			self.mapMarkers.pin.lat = self.message.lat;
			self.mapMarkers.pin.lng = self.message.lng;
			self.updateLocation();
			self.suggestPlaces();
			self.locationLoaded=true;
		})
		// navigator.geolocation.getCurrentPosition(function(geo){
		// 	self.$timeout(function(){
		// 		self.message.lat = geo.coords.latitude;
		// 		self.message.lng = geo.coords.longitude;
		// 		self.mapCenter.lat = self.message.lat;
		// 		self.mapCenter.lng = self.message.lng;
		// 		self.mapMarkers.pin.lat = self.message.lat;
		// 		self.mapMarkers.pin.lng = self.message.lng;
		// 		self.updateLocation();
		// 		self.suggestPlaces();
		// 		self.locationLoaded=true;
		// 	})
		// });
	}
	Ctrl.prototype.updateLocation = function(){
		var self = this;
		this.loadingLocation=true;
		this.message.lat = this.mapMarkers.pin.lat;
		this.message.lng = this.mapMarkers.pin.lng;
		this.server.get('/geocode/reverse_geocode',{
			lat:this.mapMarkers.pin.lat,
			lon:this.mapMarkers.pin.lng
		}).success(function(d){
			self.loadingLocation=false;
			self.message.poi=null;
			if(self.addingNewPlace){
				self.message.address='';
				self.message.osm_id=null;
			}
			else {
				self.mapMarkers.pin.icon = self.locationPin;
				self.message.address = d.address;
				self.message.osm_id = d.osm_id;
				self.message.newplace='';
			}
		})
		.error(function(){
			self.loadingLocation=false;
		})
	};

	Ctrl.prototype.suggestPlaces = function(){
		var self = this;
		this.server.get('/geocode/poi',{lat:this.mapMarkers.pin.lat,lon:this.mapMarkers.pin.lng}).success(function(d){
			self.places = d.result;
		});
	};
	Ctrl.prototype.choosePlace = function(place){
		this.message.poi = place;
		this.message.newplace='';
		this.coords.lat = place.lat;
		this.coords.lng = place.lon;
		this.message.lat = place.lat;
		this.message.lng = place.lon;


		this.mapCenter.lat = this.coords.lat;
		this.mapCenter.lng = this.coords.lng;
		this.mapMarkers.pin.icon = this.poiPin(place.icon);
		this.mapMarkers.pin.icon.html=='';
		this.mapMarkers.pin.lat = this.coords.lat;
		this.mapMarkers.pin.lng = this.coords.lng;
		this.$scope.$broadcast('scrolltop',0);
		// this.updateLocation();
		this.suggestPlaces();
	}
	Ctrl.prototype.chooseLocation = function(){
		this.toCurrentLocation();
		this.message.poi = null;
		this.view='location';
		this.mapMarkers.pin.draggable=true;
	};

	Ctrl.prototype.addNewPlace = function(){
		this.addingNewPlace=true;
		this.mapMarkers.pin.icon = this.poiPin('+');
	};

	Ctrl.prototype.done = function(){
		this.$scope.$emit('locationDone');
	}

	function Directive (CONFIG) {
		return {
			restrict:'E',
			controller:['$scope','$timeout','Server',Ctrl],
			controllerAs:'ctrl',
			templateUrl:'views/partials/new-location.html',
			scope:{
				message:'='
			},
			link:function($scope,el){
				$scope.mapDefaults = {
					tileLayer: CONFIG.mapBaseUrl + CONFIG.mapStyle + '/{z}/{x}/{y}.png',
		            maxZoom: 19,
		            dragging: true,
		            touchZoom: false,
		            doubleClickZoom: false,
		            boxZoom: false,
		            tap: true,
		            zoomControl:false
				}
			}
		}
	}

	angular.module('nearhoodApp').directive('newLocation',['CONFIG',Directive]);
})();