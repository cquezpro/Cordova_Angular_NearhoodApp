/* global angular,_ */
'use strict';

(function(){
	var Districts = function(service, $scope, $state, user){
		_.extend(this,{
			service: service,
			$scope:$scope,
			$state:$state,
			user:user
		});
		var self = this;
				
		this.loading=true;
		this.error=false;
		this.nearby=[];
		this.recent=[];
		this.cities=[];
		this.districts=[];
		this.view = $state.params.view;

		if(this.view==='nearby'){
			if(user.isLoggedIn()){
				service.getRecent().then(function(d){
					self.loading=false;
					self.recent = d;
				});
			}

			service.getNearby().then(function(d){
				self.loading=false;
				self.nearby = d;
			},function(){
				self.loading=false;
				self.error=true;
			});
		}
		else if(this.view==='city'){
			service.getCities().then(function(d){
				self.loading=false;
				self.cities = d;
			},function(){
				self.loading=false;
				self.error=true;
			});
		}
		else {
			//this.view has the city code
			service.getDistrictsFrom(this.view).then(function(d){
				self.loading=false;
				self.districts = d;
			},function(){
				self.loading=false;
				self.error=true;
			});
		}
	};

	Districts.prototype.change = function(district){
		this.service.change(district);
		this.$state.go('messages',{type:'all'});
	};

	Districts.prototype.getPosition = function(){
		this.loadingStatus = {
			positionLoading: true,
			positionLoadError: false,
			noDistrictsNear: false,
			districtsLoading: false,
			districtsLoadError: false
		};
		var self = this,
			success = function(position){
				self.service.getDistrictsFromPosition(position).then(function(data) {
					var counter = 0;
					for (var i in data) {
						console.log(i, data[i].point_distance);
						counter++;
						if (data[i].point_distance > 1500) { //pop out districts that are too far (1.5km) away
							delete data[i];
							counter--;
						}
					};
					if (counter > 0) { // close enough matches found
						self.suggestedDistricts = data;
						self.loadingStatus.positionLoading = false;
						self.showDistricts.suggested = true;
					} else { //nothing closeby, just display all districts instead
						self.loadingStatus.positionLoading = false;
						self.loadingStatus.noDistrictsNear = true;
						self.showDistricts.all = true;
					}
					// self.$scope.$apply();
				});
			},
			error = function(){
				self.loadingStatus.positionLoading = false;
				self.loadingStatus.positionLoadError = true;
				// self.$scope.$apply();
			};
		navigator.geolocation.getCurrentPosition(success, error, {timeout: 12000});
	}

	Districts.$inject = ['District','$scope','$state','user'];

	angular.module('nearhoodApp').controller('nhDistrictsCtrl',Districts);
})();