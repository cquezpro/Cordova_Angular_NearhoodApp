/* global angular */
(function(){
	function SearchLocation ($timeout,CONFIG,$http,$scope,server, $stateParams, $filter) {
		_.extend(this,{
			$timeout:$timeout,
			CONFIG:CONFIG,
			$http:$http,
			$scope:$scope,
			server:server
		});
		this.loading=false;
		this.address='';
		this.search = $filter('firstpart')($stateParams.search);
		// this.getResults();
		this.changed=false;
	}
	SearchLocation.prototype.change = function(){
		var self = this;
		this.changed=true;
		if(this.search.length>2){
			this.$timeout.cancel(this.resultPromise);
			this.resultPromise = this.$timeout(function(){
				self.getResults();
			},2000);
		}
	};
	SearchLocation.prototype.clearSearch = function(){
		this.search='';
		this.$scope.$broadcast('focusSearch');
	}
	SearchLocation.prototype.test = function(){

	}

	SearchLocation.prototype.getResults = function(){
		var self = this;
		this.loading=true;
		this.places = [];
		this.server.get('/geocode/poi',{
			lat:this.$scope.ctrl.mapMarkers.pin.lat,
			lon:this.$scope.ctrl.mapMarkers.pin.lng,
			name:this.search
		}).success(function(d){
			console.log(d.result);
			self.places = self.places.concat(d.result);
			self.loading=false;
		},function(){
			self.loading=false;
		});
		this.server.get('/geocode/address_search',{
			lat:this.$scope.ctrl.mapMarkers.pin.lat,
			lon:this.$scope.ctrl.mapMarkers.pin.lng,
			address:this.search
		}).success(function(d){
			self.places = self.places.concat(d.result);
			// self.places.push(d)
		})
	};

	SearchLocation.prototype.choose = function(result){
		this.$scope.$emit('locationChosen',result);
	};
	SearchLocation.$inject=['$timeout','CONFIG','$http','$scope','Server','$stateParams', '$filter'];
	angular.module('nearhoodApp').controller('nhSearchLocation',SearchLocation);
})();