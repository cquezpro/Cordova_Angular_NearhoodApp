/* global angular,_,ga_storage */

(function(){
	'use strict';
	function Comment (data) {
		_.extend(this,{
			liked:false,
			loginPrompt:false,
			stars:0
		});
		if(data){
			_.extend(this,data);
			if(data.current_user_likes){
				this.liked=true;
			}
			this.id=this._id;
		}
	}

	Comment.prototype.like = function($event){
		if($event){
			$event.stopPropagation();
		}
		if(Comment.user.isLoggedIn()){
			var self = this;
			self.stars++;
			ga_storage._trackEvent('Messages', 'commentLike', self.id);
			self.liked=true;
			Comment.server.post('/messages/like',{
				id:this.sanomid,
				commentid:this.id,
				like:'like'
			})
			.success(function(){
				Comment.server.postForm('/sanom/sociallike',{sanomid:self.sanomid,commentid:self.id});
			});
		}
		else {
			this.loginPrompt = true;
		}
	};
	Comment.prototype.unlike = function($event){

		var self = this;
		if($event){
			$event.stopPropagation();
		}
		ga_storage._trackEvent('Messages', 'commentUnlike', this.id);
		self.stars--;
		self.liked=false;
		Comment.server.post('/messages/like',{
			id:this.sanomid,
			commentid:this.id,
			like:'unlike'
		});
	};

	Comment.$factory = [
		'Server', 'user',
		function(Server, User){
			Comment.server = Server;
			Comment.user = User;
			return Comment;
		}
	];
	angular.module('nearhoodApp').factory('nhComment',Comment.$factory);
})();