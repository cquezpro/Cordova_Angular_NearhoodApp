/* global angular */
'use strict';

(function(){
	var config = function ($stateProvider, $urlRouterProvider, $httpProvider, ServerProvider, localStorageServiceProvider) {
		
		// ServerProvider.host = 'https://sanom.at/api'
		// ServerProvider.host = 'http://a.sanomat.info/api';
		ServerProvider.host = 'https://api.nearhood.net/api';
		localStorageServiceProvider.setPrefix('nh-');
		$httpProvider.interceptors.push('noCacheInterceptor');

		$urlRouterProvider
			.when('/messages//new','/messages/all/new')
			.when('/districts','/districts/nearby')
			.when('/districts/','/districts/nearby')
			.otherwise('/messages/all');

		$stateProvider
			.state('messages',{
				url:'/messages/:type',
				controller:'nhMessagesCtrl as messages',
				templateUrl:'views/messages.html'
			})
			.state('messages.view',{
				url:'/message/:id',
				controller:'nhSingleCtrl as single',
				templateUrl:'views/single.html'
			})
			.state('messages.login',{
				url:'/login',
				controller:'nhLoginCtrl as login',
				templateUrl:'views/login.html'
			})
			.state('messages.register',{
				url:'/login',
				controller:'nhRegisterCtrl as register',
				templateUrl:'views/register.html'
			})
			.state('messages.view.login',{
				url:'/login',
				controller:'nhLoginCtrl as login',
				templateUrl:'views/login.html'
			})
			.state('messages.view.register',{
				url:'/register',
				controller:'nhRegisterCtrl as register',
				templateUrl:'views/register.html'
			})
			.state('messages.new',{
				url:'/new/:newtype',
				controller:'nhNewMessage as message',
				templateUrl:'views/new-message.html'
			})
			.state('messages.new.location',{
				url:'/location',
				controller:'nhNewLocationCtrl as ctrl',
				templateUrl:'views/new-location.html'
			})
			.state('messages.new.location.search',{
				url:'/location/:search',
				controller:'nhSearchLocation as srcCtrl',
				templateUrl:'views/search-location.html'
			})
			.state('info',{
				url:'/info',
				controller:'nhInfoCtrl as info',
				templateUrl:'views/info.html'
			})
			.state('info.new',{
				url:'/new',
				controller:'nhNewMessage as message',
				templateUrl:'views/newMessage.html'
			})
			.state('info.feedback',{
				url:'/feedback',
				controller:'nhFeedbackCtrl as feedback',
				templateUrl:'views/feedback.html'
			})
			.state('user',{
				url:'/user',
				controller:'nhUserCtrl as user',
				templateUrl:'views/user.html'
			})
			.state('user.login',{
				url:'/login',
				controller:'nhLoginCtrl as login',
				templateUrl:'views/login.html'
			})
			.state('user.register',{
				url:'/register',
				controller:'nhRegisterCtrl as register',
				templateUrl:'views/register.html'
			})
			.state('welcome',{
				url:'/welcome/:view',
				controller:'nhWelcomeCtrl as welcome',
				templateUrl:'views/welcome.html'
			})
			.state('districts',{
				url:'/districts/:view',
				controller:'nhDistrictsCtrl as districts',
				templateUrl:'views/districts.html'
			})
			.state('registered',{
				url:'/registered',
				templateUrl:'views/registered.html'
			})
			;


		delete $httpProvider.defaults.headers.common['X-Requested-With']; // needed to get cross-domain API calls to work, see https://github.com/angular/angular.js/pull/1454  
		$httpProvider.defaults.headers.common['X-Nearhood-App-Version']=appVersion;
		if (window.device) {
			$httpProvider.defaults.headers.common['X-Nearhood-App-OS']=window.device.platform;
			$httpProvider.defaults.headers.common['X-Nearhood-App-OSversion']=window.device.version;    
		}
	};

	angular.module('nearhoodApp').factory('noCacheInterceptor', function () {
	            return {
	                request: function (config) {
	                    if(config.method=='GET'){
	                        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
	                        config.url = config.url+separator+'noCache=' + new Date().getTime();
	                    }
	                    return config;
	               }
	           };
	    });

	config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', 'ServerProvider','localStorageServiceProvider'];
	angular.module('nearhoodApp').config(config);



	
})();

window.addEventListener('load', function() {
	console.log('load');
    FastClick.attach(document.body);
}, false);