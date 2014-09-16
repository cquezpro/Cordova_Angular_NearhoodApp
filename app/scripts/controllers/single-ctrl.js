/* global angular,_ */
'use strict';

(function(){
	
	var Single = function(UIService, $stateParams, leafletData, $timeout, CONFIG, OS, Server, Message, Comment, User, $scope){
		var self = this;
		this.model = UIService.getOpenedMessage();
		this.issueCenter = {lat: 0, lng: 0, zoom:15};
		this.isAndroid40 = OS.isAndroid40();
		this.switches={};
		this.user = User;
		this.server = Server;
		this.comment = Comment;
		User.get().then(function(d){
			self.userInfo=User.data;
		})
		this.extended=false;


		Server.get('/messages/',{id:$stateParams.id}).success(function(data){
			self.extended=true;
			if(self.model!==null){
				_.extend(self.model,data.message);
			}
			else {
				self.model = new Message(data.message);
			}
			var comments = _.clone(self.model.comments);
			self.model.comments = [];
			for(var i=0;i<comments.length;i++){
				self.model.comments.push(new Comment(comments[i]));
			}
			
			if(self.model.type=='issue'){
				self.issueCenter = {
					lat: parseFloat(self.model.geo.point.coordinates[1]),
					lng: parseFloat(self.model.geo.point.coordinates[0]),
					zoom:15
				}
				self.issueMarkers = {
					centerMarker:{
						lat: self.issueCenter.lat,
						lng: self.issueCenter.lng,
						focus:true,
						draggable:false
					}
				}

				$timeout(function() { //for some reason to display the tiles correctly the map size needs to be recalculated after a short delay
                    leafletData.getMap().then(function(map) {
                        map.invalidateSize();
                        //disable all touch interactions so that we are able to scroll the page normally! Note that some of these CAN'T be set via $scope.mapDefaults since angular-leaflet is missing handling of some parameters
                        map.dragging.disable();
                        map.touchZoom.disable();
                        map.doubleClickZoom.disable();
                        map.scrollWheelZoom.disable();
                        if (map.tap) {
                        	map.tap.disable();
                        }
                    });
                }, 100);
			}

			if(self.user.isLoggedIn()){
				self.newComment = {
					sanomid:self.model.id
				}
			}

			if(self.model.hasOwnProperty('geo')){
				if(self.model.geo.length>0){
					self.model.geo = self.model.geo[0];
				}
				self.mapCenter = {
					lat: self.model.geo.point.coordinates[1],
					lng: self.model.geo.point.coordinates[0],
					zoom:15
				}
				self.mapMarker = {
					pin: {
						lat: self.model.geo.point.coordinates[1],
						lng: self.model.geo.point.coordinates[0],
						focus:true,
						draggable:false
					}
				}
			}
		})

		self.mapDefaults = {
			tileLayer: CONFIG.mapBaseUrl + CONFIG.mapStyle + '/{z}/{x}/{y}.png',
            maxZoom: 19,
            scrollWheelZoom: false,
            dragging: false,
            touchZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            tap: false,
		}

		$scope.$on('loggedIn',function(){
			self.model.loginPrompt=false;
			for(var i=0;i < self.model.comments.length; i++){
				self.model.comments[i].loginPrompt=false;
			}
		});

		
	};

	Single.prototype.sendComment = function(){
		var self = this;
		this.sending=true;
		this.server.postForm('/sanom/add_comment',this.newComment).success(function(d){
			
			self.sending=false;
			ga_storage._trackEvent('Messages', 'Comment', self.model.id);
			self.server.postForm('/sanom/socialcomment',{
				sanomid:self.model.id,
				commentid:d.commentid,
				explicit_share:self.switches.fbShare
			});

			self.model.comments.push(new self.comment({
				_id:d.commentid,
				sanomid:self.model.id,
				time:new Date(),
				username:self.userInfo.name,
				profile_photo_url:self.userInfo.imgUrl,
				profile_photo_thumb_url:self.userInfo.imgThumbUrl,
				comment:self.newComment.comment
			}));
			self.newComment = {
				sanomid:self.model.id
			};
		})
	};

	Single.prototype.back = function(){
		window.history.back();
	};

	Single.$inject = ['UIService','$stateParams','leafletData','$timeout', 'CONFIG','os', 'Server','nhMessage','nhComment', 'user', '$scope'];

	angular.module('nearhoodApp').controller('nhSingleCtrl', Single);
})();
