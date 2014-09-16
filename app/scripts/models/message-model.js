/* global angular,_,ga_storage */

(function(){
	'use strict';
	function Message (data){
		_.extend(this,{
			comments:[],
			type:'sanom',
			liked:false,
			loginPrompt:false,
			stars:0,
			sanom:''
		});
		if(data.current_user_likes){
			this.liked=true;
		}
		_.extend(this,data);
		this.id=this._id;
	}

	Message.prototype.like = function($event){
		if($event){
			$event.stopPropagation();
		}
		if(Message.user.isLoggedIn()){
			var self = this;
			self.stars++;
			ga_storage._trackEvent('Messages', 'like', self.id);
			self.liked=true;
			Message.server.post('/messages/like',{
				id:this._id,
				like:'like'
			})
			.success(function(){
				Message.server.postForm('/sanom/sociallike',{sanomid:self.id});
			});
		}
		else {
			this.loginPrompt = true;
		}
	};
	Message.prototype.unlike = function($event){
		var self = this;
		if($event){
			$event.stopPropagation();
		}
		ga_storage._trackEvent('Messages', 'unlike', this.id);
		self.stars--;
		self.liked=false;
		Message.server.post('/messages/like',{
			id:this.id,
			like:'unlike'
		});
	};
	Message.prototype.open = function($event){
		if(this.type==='photopick'){
			$event.stopPropagation();
			ga_storage._trackEvent('Messages', 'openExternalUrl', this.url);
			window.open('https://nearhood.net/redirect?url='+encodeURIComponent(this.url)+'&id='+this.id, '_blank', 'location=yes');
		}
		else {
			Message.UIService.setOpenedMessage(this);
			Message.$state.go('messages.view',{id:this.id});
		}
	}

	Message.$factory = [
		'Server',
		'user',
		'$state',
		'UIService',
		function(Server,User,$state,UIService){
			Message.server = Server;
			Message.user = User;
			Message.$state = $state;
			Message.UIService = UIService;
			return Message;
		}
	];
	angular.module('nearhoodApp').factory('nhMessage',Message.$factory);
})();