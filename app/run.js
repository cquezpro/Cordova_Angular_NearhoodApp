/* global angular */
'use strict';

(function(){
	var run = function($http, $angularCacheFactory, welcome, $location, $timeout, user, gettextCatalog, language){
		//CACHE SETTINGS
		$angularCacheFactory('defaultCache', {
			maxAge: 240000, // Items added to this cache expire after 4 minutes.
			cacheFlushInterval: 3000000, // This cache will clear itself every 50mins.
			aggressiveDelete: true // Items will be deleted from this cache right when they expire.
		});
		$http.defaults.cache = $angularCacheFactory.get('defaultCache');
		
		if (!welcome.state.welcomeShown) {
			$location.path('/welcome/');
		}
		
		//LOCALISATION
		language.initLanguage();
		gettextCatalog.debug = true;

		//iOS statusbar plugin
		$timeout(function() {
			if(window.hasOwnProperty('StatusBar')){
				StatusBar.overlaysWebView(false);
				StatusBar.styleDefault();
				StatusBar.backgroundColorByHexString("#ffffff");
				var body = document.getElementsByTagName('body');
				angular.element(body).addClass("statusBarFix");
			}
		}, 1000);
		
	}

	run.$inject = ['$http', '$angularCacheFactory', 'welcome', '$location', '$timeout', 'user', 'gettextCatalog', 'language'];
	angular.module('nearhoodApp').run(run);
})();