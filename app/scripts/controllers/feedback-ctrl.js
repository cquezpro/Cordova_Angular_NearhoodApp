/* global angular, _ , device */
'use strict';

(function(){
	function Feedback ($http,District,CONFIG,$scope, gettextCatalog) {
		_.extend(this,{
			$http:$http,
			district:District,
			CONFIG:CONFIG,
			$scope:$scope,
            gettextCatalog:gettextCatalog

		});
		this.data = {};
		this.sendingStatus = {};
                
	}
	Feedback.prototype.send = function(){
		this.sendingStatus.sending=true;
		var self = this;
		this.$http({
			method:'post',
			withCredentials:true,
			url:encodeURI(this.CONFIG.protocol+this.CONFIG.server+this.CONFIG.apiPath+'feedback'),
			data:_.extend(this.data,{
				district:self.district.current.district_code,
				platform: device.platform,
				model:device.model,
				osversion:device.version,
				appversion:this.CONFIG.version
			})
		})
		.success(function(){
			self.sendingStatus.sending=false;
			self.$scope.$emit('closeSideview');
			//todo: translate those
			self.$scope.$emit('notify',{
				message: self.gettextCatalog.getString('Thank you for your feedback!'),
				icon:'icon-thumbs-up'
			});
		})
		.error(function(){
			self.sendingStatus.sending=false;
			self.$scope.$emit('notify',{
				message: self.gettextCatalog.getString('Something went wrong :/'),
				'class':'error'
			});
		})
	};

	Feedback.$inject = ['$http','District','CONFIG','$scope', 'gettextCatalog'];

	angular.module('nearhoodApp').controller('nhFeedbackCtrl', Feedback);
})();