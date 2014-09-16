'use strict';

angular.module('nearhoodApp')
	.factory('language', ['localStorageService', 'gettextCatalog', '$http', function(storage, gettextCatalog, $http) {

	    // Service logic
		var lang = {
			currentLanguage: "",
			options: [
				{code:"fi_FI", name:"suomi"},
				{code:"en", name:"English"}
			]
		};
		
	    // Public API here
		return {
		    state: lang,
		    
		    initLanguage: function () {
				this.state.currentLanguage = storage.get('language'); // get saved data from localStorage
				if (!this.state.currentLanguage) {
				    this.state.currentLanguage = "fi_FI"  // defaults to Finnish
			    }
			    gettextCatalog.currentLanguage = this.state.currentLanguage;
			    $http.defaults.headers.common['Accept-Language']=this.state.currentLanguage;
		    },
		    changeLanguage: function (newLang) {
		    	this.state.currentLanguage = newLang;
		    	gettextCatalog.currentLanguage = this.state.currentLanguage;
			    storage.set('language',this.state.currentLanguage); //save to localStorage
			    $http.defaults.headers.common['Accept-Language']=this.state.currentLanguage;
		    }
	    };
	}]);
