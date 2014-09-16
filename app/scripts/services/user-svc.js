/* global angular, ga_storage, device, _ */
(function(){
	'use strict';

	var TOKEN_STORE = 'token',
		USER_STORE = 'user';

	var User = function(Server, Store, CONFIG, $q, $timeout,$http){
		Server.setToken(Store.get(TOKEN_STORE));
		var data = {};

		var state = {
			afterLogin:null,
			district:null
		};

		function login(data,success,error){
			Server.post('/authentication/login', data, function(response, status){
				if(status>=400){
					return error(response,status);
				}
				else {
					setToken(response.token);
					get().then(function(){
						success(state.afterLogin);
					});
				}
			});
		}

		function signup(data,success,error){
			//to be deprecated in the future when we have proper backend
			var host = Server.host.substr(0,Server.host.length-4);
			//todo:this is just a super duper bad hack
			$http({
				method:'post',
				//url:encodeURI(Server.host+'/sanom/process_registration'),
                url:encodeURI(host+'/sanom/process_registration'),
				headers:{
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data:_.extend(data,{
					// district_code:this.district.currentDistrict.path,
					mobile_registration:true,
					uuid:device.uuid,
					platform:device.platform,
					device:device.name,
					version:device.version,
					password2:''
				}),
				transformRequest:function(obj){
					var str = [];
					for(var p in obj){
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
					return str.join("&");
				}
			})
			.success(function(d){
				//this should respond with token in future, so we don't have to send this additional xhr
				if(d.success==='success'){
					$timeout(function(){
						login({
							email:data.email,
							password:data.password
						},function(){
							success();
						},function(){
							error();
						})
					},1000);
				}
				else {
					error(d.message);
				}
				// login(data);
			})
			.error(function(){
				ga_storage._trackEvent('Errors', 'RegisterSanomat');
				error();
			});
		}

		//todo: fix fb signings
		function loginFb(successCb,errorCb){
			var url = CONFIG.protocol + CONFIG.server + '/sanom/redirect_to_oauth/null/null/f';
			var fbLoginWindow = window.open(url, '_blank', 'location=yes');
			
			fbLoginWindow.addEventListener('loadstop', function(event) {
				console.log('loadstop',event);
				if (event.url.lastIndexOf('regflow_f_mobiapp_close') >-1) {
					fbLoginWindow.close();
									
					//login done, now get user data based on the session cookie
					var api = 'users';
					var url2 = CONFIG.protocol+CONFIG.server+CONFIG.apiPath+api;
					$http.get(url2, { cache: false, withCredentials: true })
					.success(function(r){
						// ga_storage._trackPageview('/'+district.current.district_code+'/login/success/fb');
						ga_storage._trackEvent('User', 'login', 'fb');
						ga_storage._setCustomVar(5, 'Authenticated', 'true', 2);
						console.log(r);
						setToken(r.data.token);
						get().then(function(){
							successCb(state.afterLogin);
						});

					}).error(function(data, status){
						console.log('couldn\'t get user data');
						ga_storage._trackEvent('Errors', 'LoginFb', status);
						errorCb();
					});
				}
			});
		}
		function signupFb(successCb,errorCb){
			var url = CONFIG.protocol + CONFIG.server + '/' + state.district.city+'/'+state.district.district + '/sanom/redirect_to_oauth/null/null/f';
			console.log(url);
			var fbLoginWindow = window.open(url, '_blank', 'location=yes');

			fbLoginWindow.addEventListener('loadstop', function(event) {
				var targetUrl = CONFIG.protocol + CONFIG.server + "/sanom/regflow_f_mobiapp_close";
				if (event.url.lastIndexOf(targetUrl, 0) === 0) { // does the new page URL start with our target URL? (parameters at the end, so can't check for exact match)
					console.log("FB login done");
					fbLoginWindow.close();

					var api = 'users';
					var url2 = CONFIG.protocol+CONFIG.server+CONFIG.apiPath+api;
					$http.get(url2, { cache: false, withCredentials: true })
					.success(function(r){
						ga_storage._trackPageview('/'+state.district.district_code+'/register/success/fb');
						ga_storage._trackEvent('User', 'register', 'fb');
						ga_storage._setCustomVar(5, 'Authenticated', 'true', 2);
						setToken(r.data.token);
						get().then(function(){
							successCb(state.afterLogin);
						});

					}).error(function(data, status){
						console.log("couldn't get user data:"+data);
						ga_storage._trackEvent('Errors', 'RegisterFB', status);
						ga_storage._trackEvent('Errors', 'GetUserData');
						errorCb();
					});
				}
			});
		}
		function setToken(token){
			Store.set(TOKEN_STORE,token);
			Server.setToken(token);
		}
		function unsetToken(){
			Store.remove(TOKEN_STORE);
			Store.remove(USER_STORE);
			Server.unsetToken();
		}
		function logout () {
			Server.post('/authentication/logout', null, function(response, status){
				if (status>=400){
					return error(response,status);
				}
				else {
                                         unsetToken();
				}
			});    
       
		}
                
		function isLoggedIn(){
			if(Store.get(TOKEN_STORE)){
				return true;
			}
			else {
				return false;
			}
		}
		function get(){
			var deferred = $q.defer();
			if(Store.get(USER_STORE)){
				var d = Store.get(USER_STORE);
				for(var o in d){
					data[o]=d[o];
				}
				$timeout(function(){
					deferred.resolve();
				});
			}
			else {
				Server.get('/users/?ts='+ new Date().getTime()).success(function(d){
					data.name = d.data.full_name;
					data.fbid = d.data.fb_uid;
					data.imgUrl = d.data.profile_photo_url;
					data.imgThumbUrl = d.data.profile_photo_thumb_url;
					data.type = d.data.type;
					Store.set(USER_STORE,data);
					deferred.resolve();
				});
			}
			return deferred.promise;
			
		}
		function setDistrict (district) {
			state.district = district;
		}
		return {
			state:state,
			data:data,
			get:get,
			login:login,
			logout:logout,
			signup:signup,
			loginFb:loginFb,
			signupFb:signupFb,
			setToken:setToken,
			unsetToken:unsetToken,
			isLoggedIn:isLoggedIn,
			setDistrict:setDistrict
		};
	};

	angular.module('nearhoodApp').factory('user',['Server','localStorageService','CONFIG', '$q', '$timeout','$http', User]);

})();
