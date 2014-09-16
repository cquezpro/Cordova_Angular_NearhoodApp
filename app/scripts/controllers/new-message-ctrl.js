/* global angular,_ */
(function(){
	'use strict';
	function Message ($scope,User, Server, District, CONFIG, $timeout,$http, $cordovaGeolocation, $state, $cordovaFile, gettextCatalog) {
		this.server = Server;
		this.user = User.data;
		User.get();
		this.$http = $http;
		this.config = CONFIG;
		this.$scope = $scope;
		this.$state = $state;
		this.$timeout = $timeout;
		this.$cordovaFile = $cordovaFile;
		this.gettextCatalog = gettextCatalog;
		var self = this;

		this.data = {
			type:'sanom',
			district_code:District.current.district_code,
			district:District.current.district,
			body:'',
			datetime:new Date(),
			lat:25,
			lng:15,
			poi:null,
			streetAddress:'',
			classified_ttl:'+1 month',
			address:'',
			newplace:''
		};
		
		this.states = {
			searching:true
		};
		this.inSubView = false;

		$scope.$on('locationDone', function(){
			$scope.$broadcast('locationDoneEcho');
		});
		$scope.$on('chooseLocation', function(){
			self.view='location';
		});
		$scope.$on('$stateChangeStart', function(e,toState){
			var substate = toState.name.substr(toState.name.indexOf('.')+1);
			if(substate.indexOf('.')!==-1){
				self.inSubView=true;
			}
			else {
				self.inSubView=false;
			}
		});

		$timeout(function(){
			self.data.lat = -1;
			self.data.lng = -1;
		},200);

		$scope.afterDelay=false;
		$timeout(function(){
			$scope.afterDelay=true;
		},1500);
	}


	Message.prototype.close = function(){
		this.$state.go('messages',{type:this.$state.params.type});
	};

	Message.prototype.send = function(){
		if(!this.sending){
			var self = this;
			console.log(this.data);			
			if(this.data.type==='event'||this.data.type==='issue'){
				if(this.data.lat===-1){
					self.$scope.$emit('notify',{
						icon:'icon-remove',
						message: self.gettextCatalog.getString('Please add location')
					});
					return;
				}
			}
			if(this.data.type==='event'&&!this.data.photo&&this.data.event_description.length==0){
				self.$scope.$emit('notify',{
					icon:'icon-remove',
					message: self.gettextCatalog.getString('Please add a message or a photo')
				});
				return;			
			}
			if(this.data.type==='classified'&&!this.data.photo&&this.data.classified_content.length==0){
				self.$scope.$emit('notify',{
					icon:'icon-remove',
					message: self.gettextCatalog.getString('Please add a message or a photo')
				});
				return;			
			}
			if((this.data.type==='sanom'||this.data.type==='issue')&&!this.data.photo&&this.data.body.length==0){
				self.$scope.$emit('notify',{
					icon:'icon-remove',
					message: self.gettextCatalog.getString('Please add a message or a photo')
				});
				return;
			}

			if(this.data.type==='event'&&!this.data.photo&&this.data.event_description.length<5){
				self.$scope.$emit('notify',{
					icon:'icon-remove',
					message: self.gettextCatalog.getString('The message should be at least 5 characters')
				});
				return;			
			}
			if(this.data.type==='classified'&&!this.data.photo&&this.data.classified_content.length<5){
				self.$scope.$emit('notify',{
					icon:'icon-remove',
					message: self.gettextCatalog.getString('The message should be at least 5 characters')
				});
				return;			
			}
			if((this.data.type==='sanom'||this.data.type==='issue')&&!this.data.photo&&this.data.body.length<5){
				self.$scope.$emit('notify',{
					icon:'icon-remove',
					message: self.gettextCatalog.getString('The message should be at least 5 characters')
				});
				return;
			}
			if(this.data.photo){
				//if we're uploading a photo
				//we use a cordova plugin
				var options = new FileUploadOptions();
	            options.fileKey = this.data.type+"_photo";
	            options.fileName = "image.jpg";
	            options.mimeType = "image/jpeg";
	            // the following 2 options are a fix to an Android bug: https://issues.apache.org/jira/browse/CB-2293
				options.headers = {Connection: "close"};
				options.chunkedMode = false;
				//--
				options.headers['X-Nearhood-Unique-Id']='123';
				options.headers[this.server.headerTokenName]='token='+this.server.token;
	            options.params = transformData(this.data);
	            var ft = new FileTransfer();
	            var url = this.server.host.replace('/api.','')+'/sanom/new_sanom';
	            self.sending=true;
				ft.upload(this.data.photo, url, function(d){
					self.sending=false;
					if(d.success!=='false'){
						var response = JSON.parse(d.response); //plugin returns response as a string, let's JSONify it
						self.data._id = response.sanomid;
						self.sendSuccess();
						self.$scope.$emit('notify',{
							message: self.gettextCatalog.getString('Your message was sent!')
						});
						self.close();
					}
					else {
						self.$scope.$emit('notify',{
							icon:'icon-remove',
							message: self.gettextCatalog.getString(d.error)
						});
					}
				}, function(d){
					self.sending=false;
					alert(self.gettextCatalog.getString('something went wrong :/'));
				}, options);
			}
			else {
				this.sending=true;
				this.server.postForm('/sanom/new_sanom',transformData(this.data)).success(function(d){
					self.sending=false;
					if(d.success!==false){
						self.data._id = d.sanomid;
						self.sendSuccess();
						self.$scope.$emit('notify',{
							message: self.gettextCatalog.getString('Your message was sent!')
						});
						self.close();
					}
					else {
						self.$scope.$emit('notify',{
							icon:'icon-remove',
							message: self.gettextCatalog.getString(d.error)
						});
					}
					
				});
			}
		}
	};
	
	Message.prototype.sendSuccess = function() {
	
		console.log(this.data.district_code);
		console.log(this.data.type);
		console.log(this.data._id);
		console.log(this.user.fbid);
		console.log(this.data.fbShare);
	
		/* ANALYTICS */
		ga_storage._trackPageview('/'+this.data.district_code+'/newMessage/success/'+this.data.type);
		ga_storage._trackEvent('Messages', 'Write', this.data._id);
		
		/* POST TO SOCIAL SHARING API */					
		if (this.user.fbid) {
			var shareData = {};
			shareData.explicit_share = this.data.fbShare;
			shareData.sanomid = this.data._id;
		
			this.server.postForm('/sanom/socialshare',shareData).success(function(d){
				console.log("social sharing success");
			});
		}
		
	};
	
	Message.prototype.submit = function(){
		document.getElementById('new-msg-submit-hidden').click();
	};

	Message.$inject=['$scope','user','Server','District', 'CONFIG', '$timeout','$http', '$cordovaGeolocation', '$state','$cordovaFile', 'gettextCatalog'];
	angular.module('nearhoodApp').controller('nhNewMessage',Message);

	Message.prototype.transformToMessageModel = function(_data) {
		var data = _.clone(_data);
		data.sanom = data.body;
		data.photo = {
			url:data.photo
		};
		data.thumbnail = {
			url:data.photo.url
		};
		if(data.lat>0){
			data.geo = {
				point:{
					coordinates:[data.lng,data.lat]
				}
			}
		}
		if(!data.useAlias){
			data.username = this.user.name;
			data.profile_photo_url = this.user.imgUrl;
			data.profile_photo_thumb_url = data.profile_photo_url;
		}
		data.time = new Date();
		return data;
	}
	function transformData (origData) {
		//this function handles inconsistencies between models
		var data = {
			sanom_type:origData.type,
			district_code:origData.district_code,
			fbShare:origData.fbShare
		};
		if(origData.lat>-1){
			data.lat=origData.lat;
			data.lon=origData.lng;
		}
		if(origData.newplace!==''){
			data.osm_id = origData.osm_id;
			data.user_poi = origData.newplace;
		}
		else if(origData.poi){
			data.poi_id = origData.poi.id;
		}
		else if(origData.osm_id){
			data.osm_id = origData.osm_id;
		}
		if(origData.pseudonym){
			data.pseudonym = origData.pseudonym
		}
		//todo handle poi
		if(origData.type==='sanom'){
			// data.sanom_photo = origData.photo;
			data.sanom_body = origData.body;
		}
		else if(origData.type==='event'){
			data.event_name = origData.event_name;
			// data.event_photo = origData.photo;
			data.event_description = origData.event_description;
			data.event_date = moment(origData.event_date).format('DD.MM.YYYY');
			data.event_time_hour = origData.event_date.getHours();
			data.event_time_min = origData.event_date.getMinutes();
			if(origData.hasending){
				data.event_date_end = moment(origData.event_end_date).format('DD.MM.YYYY');
				data.event_time_end_hour = origData.event_end_date.getHours();
				data.event_time_end_min = origData.event_end_date.getMinutes();
			}
			if(origData.event_recurs){
				data.recurring_switch = origData.event_recurs;
				data.recurring = origData.event_recurs_interval;
				data.recurring_event_end = moment(origData.event_date_until).format('DD.MM.YYYY');
			}

			
			data.event_location=' ';
		}
		else if(origData.type==='classified'){
			data.classified_body = origData.classified_content;
			// data.classified_photo = origData.photo;
			data.classified_type = origData.classified_type;
			data.classified_contact = origData.classified_contact;
		}
		else if(origData.type==='issue'){
			data.issue_description = origData.body;
			// data.issue_photo = origData.photo;
			data.issue_type = origData.issue_type;
		}
		return data;
	}
})();