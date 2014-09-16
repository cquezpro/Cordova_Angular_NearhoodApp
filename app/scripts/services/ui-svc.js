/* global angular */
'use strict';
angular.module('nearhoodApp').factory('UIService',[function(){
	var state = {
		backStep:-1,
		sideviewPos:'right',
		winHeight:window.innerHeight,
		winWidth:window.innerWidth,
		openedMessage:null
	};
	return {
		state:state,
		setOpenedMessage: function(message){
			this.state.openedMessage = message;
		},
		getOpenedMessage: function(){
			return this.state.openedMessage;
		}
	};
}]);