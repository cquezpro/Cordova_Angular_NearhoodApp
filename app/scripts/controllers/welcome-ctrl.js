/* global angular,ga_storage */
'use strict';

(function(){
	function Welcome (Service, Menu, District, $state, $timeout) {
		var self = this;
		this.district = District;
		this.service = Service;
		this.$state = $state;

		this.slideNum = 1;
		this.active = 'active' + this.slideNum;

		if(!District.current.district){
			if($state.params.view===undefined || $state.params.view ===''){
				$state.go('welcome',{view:'nearby'});	
			}
		}
		else {
			$state.go('welcome',{view:'slides'});
		}

		ga_storage._trackPageview('/'+District.current.subdomain+'/welcomeInit');
		ga_storage._trackEvent('User', 'welcomeInit');



		//districts related code

		this.loading=true;
		this.error=false;
		this.nearby=[];
		this.recent=[];
		this.cities=[];
		this.districts=[];
		this.view = $state.params.view;

		if(this.view==='nearby'){

			District.getNearby().then(function(d){
				self.loading=false;
				self.nearby = d;
			},function(){
				self.loading=false;
				self.error=true;
			});
		}
		else if(this.view==='city'){
			District.getCities().then(function(d){
				self.loading=false;
				self.cities = d;
			},function(){
				self.loading=false;
				self.error=true;
			});
		}
		else {
			//this.view has the city code
			District.getDistrictsFrom(this.view).then(function(d){
				self.loading=false;
				self.districts = d;
			},function(){
				self.loading=false;
				self.error=true;
			});
		}

		this.changeDistrict = function(district){
			District.change(district);
			// $state.go('messages',{type:'all'});
			$state.go('welcome',{view:'slides'});
		}
	}

	Welcome.prototype.slide = function(amount){
		if (((amount === -1) && (this.slideNum > 1)) || ( (amount === 1) && (this.slideNum < 3) )) {
			this.slideNum = this.slideNum + amount;
			this.active = 'active' + this.slideNum;     
		}
	};

	Welcome.prototype.close = function(){
		if (!this.service.welcomeShown) {
			// first time usecase
			this.service.markWelcomeShown();
			ga_storage._trackPageview('/'+this.district.current.subdomain+'/welcomeDone');
			ga_storage._trackEvent('User', 'welcomeDone');

			this.$state.go('messages',{type:'all'});
		} else {
			// welcome view opened from settings view
			ga_storage._trackPageview('/'+this.district.current.subdomain+'/appInfo');
			window.history.back();
		}
	};

	Welcome.$inject=['welcome','menu','District','$state','$timeout'];
	angular.module('nearhoodApp').controller('nhWelcomeCtrl',Welcome);
})();