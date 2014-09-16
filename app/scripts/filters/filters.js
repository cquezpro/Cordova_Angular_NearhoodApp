'use strict';

angular.module('filters', [])
.filter('truncate', [function () {
	return function (text, length, end) {
	
		if(text) {
			if (isNaN(length))
				length = 320;

			if (end === undefined)
				end = "•••";

			if (text.length <= length || text.length - end.length <= length) {
				return text;
			}
			else {
				return String(text).substring(0, length-end.length) + end;
			}
		} else {
			return '';
		}

	};
}])
.filter('nl2br', function(){
  return function(text) {
	  if (text) {
		return text.replace(/\n/g, '<br />');
	} else {
		return '';
	}
  };
})

.filter('firstpart', function(){
  return function(text) {
  	var end = text.indexOf(',');
  	if(end===-1){
  		end = text.length;
  	}
  	text = text.substr(0,end);
  	return text;
  };
})
.filter('url2link', function() {

		// regexps from http://stackoverflow.com/a/7138764/2199358
		// http://, https://, ftp://
		var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
		// www. sans http:// or https://
		var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		// Email addresses
		var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
		
		return function(text) {
			if (text) {
				return text
					.replace(urlPattern, '<cite ng-click="openExternalUrl($event)" href="$&">$&</cite>')
					.replace(pseudoUrlPattern, '$1<cite ng-click="openExternalUrl($event)" href="http://$2">$2</cite>')
					.replace(emailAddressPattern, '<a href="mailto:$1">$1</a>');
					//TODO: nämä pitäisi vielä kierrättää palvelimen redirectin kautta msgId:llä varustettuna! var redirUrl = 'https://sanom.at/redirect?url='+encodeURIComponent(url)+'&id='+msgId;
			} else {
				return '';
			}
		};

})
.filter('isArray', function() {
  return function (input) {
    return angular.isArray(input);
  }
})
.filter('stripTags', function() {
	return function(text) {
	  return String(text).replace(/<(?:.|\n)*?>/gm, '');
	}
  }
).
filter('noHTML',[
	function(){
		return function(text){
			if (text) {
				return String(text).replace(/&/g, '&amp;')
						.replace(/>/g, '&gt;')
						.replace(/</g, '&lt;');
			} else {
				return '';
			}
		};
	}
]);