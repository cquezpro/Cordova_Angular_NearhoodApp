/* global angular, ga_storage */
'use strict';

(function(){
	'use strict';
	var DISTRICT_STORE='district';

	function District (store,server,$q,user,$timeout) {
		this.store = store;
		this.server = server;
		this.$q = $q;
		this.$timeout = $timeout;
		this.user = user;
		this.current = this.store.get(DISTRICT_STORE);
		if(!this.current){
			this.current={};
		}
		this.server.setDistrict(this.current);
		this.user.setDistrict(this.current);
	}
	District.prototype.getNearby = function(){
		var self = this, deferred = this.$q.defer();
		var promiseToAbort = this.$timeout(function(){
			deferred.reject();
		},10000);
		navigator.geolocation.getCurrentPosition(function(position){
			self.$timeout.cancel(promiseToAbort);
			self.server.get('/districts/geosearch',{
				lat:position.coords.latitude,
				lon:position.coords.longitude
			}).success(function(d){
				deferred.resolve(d.result);
			});
		});
		return deferred.promise;
	};
	District.prototype.getRecent = function(){
		var deferred = this.$q.defer();
		this.server.get('/districts/user_last_districts').then(function(d){
			deferred.resolve(d.data);
		},function(d){
			deferred.reject();
		});
		return deferred.promise;
	};
	District.prototype.getCities = function(){
		var deferred = this.$q.defer();
		this.server.get('/districts/list',{cities:true}).then(function(d){
			deferred.resolve(d.data.result);
		},function(){
			deferred.reject();
		});
		return deferred.promise;
	};

	District.prototype.getDistrictsFrom = function(cityCode){
		var deferred = this.$q.defer();
		this.server.get('/districts/list',{parent:cityCode}).then(function(d){
			deferred.resolve(d.data.result);
		},function(){
			deferred.reject();
		});
		return deferred.promise;
	};

	District.prototype.change = function(to){
		this.current = to;
		this.store.set(DISTRICT_STORE,to);
		this.server.setDistrict(to);
		this.user.setDistrict(to);

		if(this.user.isLoggedIn()){
			this.server.post('/users/set_district',{district_code:to.district_code});
		}

		ga_storage._trackPageview('/'+to.district_code+'/changeDistrict');
		ga_storage._setCustomVar(1, 'District', to.district_code, 2);
		ga_storage._trackEvent('User', 'changeDistrict');
	};
	District.$inject=['localStorageService','Server','$q','user','$timeout'];
	angular.module('nearhoodApp').service('District',District);
})();