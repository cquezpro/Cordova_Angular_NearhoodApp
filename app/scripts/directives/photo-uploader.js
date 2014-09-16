/* global angular, Camera, ga_storage */
'use strict';
(function(){
	console.log('here');
	angular.module('nearhoodApp')
	.directive('nhPhotoUploader',
		['$cordovaCamera', '$cordovaDialogs', 'gettextCatalog',
		function($cordovaCamera, $cordovaDialogs, gettextCatalog){
			return{
				restrict:'E',
				transclude:true,
				require:'?ngModel',
				scope:{
					ngModel:'='
				},
				// template:'<div><div class="white-btn"><i class="icon-camera"></i>add photo</div></div>',
				template:"<a class=\"pure-button pure-input-1 pure-button-primary\"><i class=\"icon-camera\"></i> "+gettextCatalog.getString('add photo')+"</a>",
				link: function($scope,el,attrs,ngModel){
					new Hammer(el[0]).on('tap',function(){
						$cordovaDialogs.confirm(
                                                        /// 'Haluatko ottaa uuden kuvan kameralla vai valita kuvan albumista?'
                                                        gettextCatalog.getString('Do you want to take a new photo or choose from gallery?'), // message
							 choosePhotoMethod,            // callback to invoke with index of button pressed
							gettextCatalog.getString('Add photo to message'),           /// title 'Lisää kuva sanomaan'
							[gettextCatalog.getString('Take a photo'), gettextCatalog.getString('Choose from gallery'), gettextCatalog.getString('Cancel')]         // buttonLabels
						);
					});

					function choosePhotoMethod (buttonIndex) {
						var source,
							saveToAlbum,
							canceled;
						
						switch (buttonIndex) {
						case 1: //take photo
							source = Camera.PictureSourceType.CAMERA;
							saveToAlbum = true;
							break;
						
						case 2://select existing photo
							source = Camera.PictureSourceType.PHOTOLIBRARY;
							saveToAlbum = false;
							break;
						
						case 3: //cancel
							canceled = true;
							break;
						}
						
						if (canceled) { 
							return;
						} else {
							$cordovaCamera.getPicture({
								quality: 49,
								destinationType: Camera.DestinationType.FILE_URI,
								sourceType : source,
								encodingType: Camera.EncodingType.JPG,
								targetWidth: 880,
								targetHeight: 880,
								mediaType: Camera.MediaType.PICTURE,
								correctOrientation: true,
								saveToPhotoAlbum: saveToAlbum
								})
								.then(function (imageUrl) {
									// alert(imageUrl)
									ngModel.$setViewValue(imageUrl);
									ga_storage._trackEvent('Messages', 'photoAddedToNewMessage');
							}, function(){
								ga_storage._trackEvent('Errors', 'cameraFail', message);
							});
						}
					}

					$scope.cancel = function(){
						ngModel.$setViewValue(null);
					}

					$scope.getPhoto = function(){
						return ngModel.$viewValue;
					}
				}
			}
		}
	]);
})();