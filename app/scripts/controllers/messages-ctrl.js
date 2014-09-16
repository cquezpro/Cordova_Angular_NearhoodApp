/* global angular,_,ga_storage */
'use strict';

(function(){
	var Messages = function($stateParams, UIService, User, OS, $timeout, $scope, $state, Server, Message, CONFIG,leafletEvents, District){
		
		_.extend(this,{
			district: District,
			UIService: UIService,
			os:OS,
			user:User,
			$timeout: $timeout,
			$state:$state,
			$stateParams:$stateParams,
			$scope:$scope,
			server:Server,
			message:Message,

			loading:true,
			nextBatch:{},
			messageBatch:1,
			canLoadMore:false,
			loadingStatus:{}
		});
		this.params = {
			type:$stateParams.type,
			district: District.current.district_code,
			scope:'neighbours'
		};
		if(this.params.type==='highlight'){
			this.params.type='digest';
			this.params.score_period='weekly';
		}
                else if (this.params.type==='all') {
                    this.params.page='front';
                }
                else if (this.params.type==='event') {
                    this.params.list_type='flat';
                }

		this.all=[];
		this.load();
		var self =this;

		$scope.$on('reloadMessages',this.reload);
		$scope.$on('newmessage',function(e,message){
			$timeout(function(){
				self.all.splice(0,0,new Message(message));
			},1000);
		});

		$scope.inSubview = function(){
			if($state.current.name.indexOf('.')!==-1){
				return true;
			}
			else {
				return false;
			}
		}

		$scope.$on('loggedIn',function(){
			for(var i=0;i < self.all.length; i++){
				self.all[i].loginPrompt=false;
			}
		});

		this.mode='list';
	};
	Messages.prototype.switchMode= function(mode){
		this.mode=mode;
		if(this.mode==='list'){
			this.$scope.$emit('loadedMessages');
		}
		else {
			this.map.init();
		}
	};
	Messages.prototype.load = function(){
		var self = this;
		this.loading=true;
		if (!this.params.mtype) {
			this.params.mtype = this.params.type;
		}
		// this.params.scope='parent';
		this.server.get('/messages/list',this.params).success(function(data){
			ga_storage._trackPageview('/'+self.district.current.subdomain+'/messages/'+self.params.mtype);
			ga_storage._trackEvent('Messages', 'list', self.params.mtype);
			ga_storage._setCustomVar(2, 'Section', self.params.mtype, 2);
			
			for(var i=0;i<data.messages.length;i++){
				self.all.push(new self.message(data.messages[i]));
				injectRandomCoords(self.all[self.all.length-1],42.6965295,23.3122083);
			}
			if(self.mode==='map'){
				self.updatePins();
			}
			self.loading=false;
			self.$scope.$emit('loadedMessages');
			self.nextBatch.start = data.next_args.start;
			if (self.nextBatch.start) {
				self.canLoadMore = true;
			} else {
				self.canLoadMore = false;
			}
			// Android doesn't render the active tab style unless we force a 1px change to translate3d here once the messages are loaded
			if (self.os.mobile.Android) {
				angular.element(document.getElementById("sideMenu")).addClass("forceUpdate");
			}
		})
		.error(function(e){
			self.canLoadMore=false;
			self.loading=false;
			self.error=true;
			ga_storage._trackEvent('Errors', 'messageListLoad');
		})
	};
	Messages.prototype.reload = function(){
		this.all = [];
		var self = this;
		this.loading=true;
		this.$timeout(function(){
			self.load();
		},300)
		
		ga_storage._trackEvent('Messages', 'reload');
	}

	Messages.prototype.more = function(){
		var self = this;
		if(this.canLoadMore){
			this.params.start = this.nextBatch.start;
			this.messageBatch++;
			this.loading=true;
			this.server.get('/messages/list',this.params).success(function(data){
				ga_storage._trackPageview('/'+self.district.current.subdomain+'/messages/'+self.params.mtype+'/more/'+self.messageBatch);
				ga_storage._trackEvent('Messages', 'listMore', self.params.mtype, self.messageBatch);

				for(var i=0;i<data.messages.length;i++){
					self.all.push(new self.message(data.messages[i]));
				}
				self.nextBatch.start = data.next_args.start;
				if (self.nextBatch.start) {
					self.canLoadMore = true;
				} else {
					self.canLoadMore = false;
				}
				self.loading = false;
				self.$scope.$emit('loadedMessages');
			});
		}
	};

	Messages.prototype.injectMoreFromUser = function(message,$index){
		var self = this;
		var num = message.more_from_same.num,
			start = message.more_from_same.start;
		message.more_from_same=false;
		self.loading = true;
		this.server.get('/messages/list',_.extend(_.clone(this.params),{
			context:'more_from_same', 
			userid:message.userid,
			num:num,
			start:start
		})).success(function(data) {
			for(var i=0;i<data.messages.length;i++){ //start from 1st element cuz backend responds with the same message in the beginning
				self.all.splice($index+1,0,new self.message(data.messages[i]));
			}
			self.$scope.$emit('loadedMessages');
			self.loading = false;
		});
	};

	Messages.prototype.reload = function(){
		this.nextBatch.start = '';
		this.params.start = '';
		this.all = [];
		ga_storage._trackEvent('Messages', 'reload');
		var self =this;
		this.$timeout(function(){
			self.load();
		},300)
	};

	Messages.prototype.open = function(message,$event){
		if(message.type==='photopick'){
			$event.stopPropagation();
			var inApp = angular.element($event.currentTarget).attr('data-inappbrowser');

			ga_storage._trackEvent('Messages', 'openExternalUrl', message.url);
			var redirUrl = 'https://nearhood.net/redirect?url='+encodeURIComponent(message.url)+'&id='+message._id;
			
			if (inApp) {
				window.open(redirUrl, '_blank', 'location=yes');
			} else {
				window.open(redirUrl, '_system');
			}
		}
		else {
			this.UIService.setOpenedMessage(_.clone(message));
			this.$state.go('messages.view',{id:message._id});
		}
	};

	Messages.prototype.login = function($event){
		$event.stopPropagation();
		this.$state.go('messages.login');
	};

	Messages.$inject = ['$stateParams', 'UIService', 'user', 'os', '$timeout', '$scope', '$state', 'Server', 'nhMessage', 'CONFIG','leafletEvents','District'];
	angular.module('nearhoodApp').controller('nhMessagesCtrl',Messages);


	function injectRandomCoords (model,lat,lng) {
		var power = 0.009;
		var lat = lat - power + Math.random()*power*2;
		var lng = lng - power + Math.random()*power*2;
		model.lat = lat;
		model.lng = lng;
	}
})();