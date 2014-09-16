/* global angular, ga_storage, _, device */
'use strict';

(function(){
	function Register ($scope, User, District, $state) {
		_.extend(this,{
			$scope:$scope,
			$state:$state,
			user:User,
			data:{
				full_name:'',
				password:'',
				email:''
			}
		});
		ga_storage._trackPageview('/'+District.current.subdomain+'/register');
	};

	Register.prototype.register = function(){
		var self = this;
		this.user.signup(this.data,function success(){
			self.$scope.$emit('closeSideview');
			self.$state.go('registered');
		}, function error (d) {
			if(!d){
				d='something went wrong';
			}
			self.$scope.$emit('notify',{
				icon:'icon-remove',
				message: d
			});
		});
	};

	Register.prototype.fbRegister = function(){
		var self = this;
		this.user.signupFb(function success (data) {
			self.$scope.$emit('closeSideview');
			self.$state.go('messages',{type:'all'});
		}, function error () {
			
		});

	};

	Register.$inject = ['$scope','user','District','$state'];

	angular.module('nearhoodApp').controller('nhRegisterCtrl',Register);
})();