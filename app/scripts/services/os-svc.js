'use strict';

angular.module('nearhoodApp')
	.factory('os', ['$window', function($window) {

		// Public API here
		return {

			mobile: {
				Android: $window.navigator.userAgent.match(/Android/i),
				BlackBerry: $window.navigator.userAgent.match(/BlackBerry/i),
				iOS: $window.navigator.userAgent.match(/iPhone|iPad|iPod/i),
				Opera: $window.navigator.userAgent.match(/Opera Mini/i),
				Windows: $window.navigator.userAgent.match(/IEMobile/i)
			},
					
			cordova: {
				device: $window.device
			},
			
			isAndroid40: function () {
				if ($window.device) {
					return $window.device.version.match(/^4\.0/);
				} else {
					return false;
				}
			},

		};
	}]);
