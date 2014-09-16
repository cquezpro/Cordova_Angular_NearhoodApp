/* global angular,ga_storage */
'use strict';

(function(){
	var Login = function($scope,User,District, CONFIG, $state){
		this.data = {
			// email:'martin.christov@gmail.com', password:'772323'
		};
		this.user = User;
		this.$scope = $scope;
		this.$state = $state;
		this.CONFIG = CONFIG;
		ga_storage._trackPageview('/'+District.current.subdomain+'/login');
	};

	Login.prototype.login = function(){
		var self = this;

		this.user.login(this.data, function success(state){
			if(!state){
				self.$scope.$emit('closeSideview');
				self.$scope.$emit('loggedIn');
			}
			else {
				self.$state.go(state.name,state.params);
			}
		}, function error(){
			self.error=true;
		});
	};

	Login.prototype.loginFb = function(){
		var self = this;
		this.user.loginFb(function success () {
			self.$scope.$emit('closeSideview');
			self.$scope.$emit('loggedIn');
		}, function error () {
			self.error=true;
		});
	};

	Login.prototype.toRegister = function(){
		this.$state.go(this.$state.current.name.replace('login','register'));
	}

	Login.$inject = ['$scope','user','District', 'CONFIG', '$state'];

	angular.module('nearhoodApp').controller('nhLoginCtrl', Login);
})();