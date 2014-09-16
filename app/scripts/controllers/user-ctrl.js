/* global angular */
'use strict';

(function(){
	function User(service,District,$scope,gettextCatalog){
		this.service = service;
		this.service.get();
		this.gettextCatalog = gettextCatalog;
		// this.data = service.data;
		this.$scope = $scope;
		ga_storage._trackPageview('/'+District.current.subdomain+'/user');
	};
	User.prototype.logout = function(){
		var self = this;
		this.service.logout();
		self.$scope.$emit('notify',{
			message:self.gettextCatalog.getString('You have been logged out')
		});
	};
	User.$inject = ['user','District','$scope', 'gettextCatalog'];
	angular.module('nearhoodApp').controller('nhUserCtrl',User);
})();