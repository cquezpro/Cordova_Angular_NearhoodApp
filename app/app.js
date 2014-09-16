/* global angular */
'use strict';
var appVersion = '1.0.0'

angular.module('nearhoodApp', [
	'ui.router',
	'LocalStorageModule', 
	'jmdobry.angular-cache', 
	'filters', 
	'ngAnimate', 
	'leaflet-directive',
	'ngSanitize', 
	'gettext',
	'hmTouchEvents',
	'ngCordova',
	'ngTouch'
]);

angular.module('nearhoodApp').constant("CONFIG", {
	version: appVersion,
	// protocol: 'https://',
	// server: 'sanom.at',
	protocol:'http://',
	server:'fi.nearhood.net',
	apiPath: '/api/',
	messagesCluster: 6,
	apiCache: false, 
	cookieInApiReqs: false,
	mapBaseUrl: 'https://{s}.tiles.mapbox.com/v3/',
	mapStyle: 'bornlocal.hoa2p2bh',
	localDev:true,
	googleAPIKey:'AIzaSyBoqPYjpd6vtJmtNvh930Eaqz6i_b-pUr4'
});


//declare global vars that come from phonegap

var device = {
	uuid:'123',
	platform:'android',
	device:'galaxy s5',
	version:'6'
};

