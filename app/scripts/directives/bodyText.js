'use strict';

angular.module('nearhoodApp')
	.directive('bodyText', ['$filter', '$sce', function ($filter, $sce) {
		return {
			template: '<span ng-bind-html="body"></span>',
			restrict: 'EA',
			replace: true,
			link: function postLink(scope, element, attrs) {
				if (scope.body) {
					if (attrs.bodyTextTruncate) {
						scope.body = $sce.trustAsHtml($filter('url2link')($filter('nl2br')($filter('noHTML')($filter('truncate')(attrs.bodyTextContents, scope.truncate)))));
					} else {
						scope.body = $sce.trustAsHtml($filter('url2link')($filter('nl2br')($filter('noHTML')(attrs.bodyTextContents))));
					}
				}
			},
		
		};
	}]);
