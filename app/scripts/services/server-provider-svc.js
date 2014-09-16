/* global angular */

(function () {
	'use strict';
	var Server = function () {
		this.host = '';
		// this.adapter;
		this.token = null;
		this.userid = null;
		this.district = null;
		this.headerTokenName = 'X-Nearhood-Authorization';
		this.headerDistrictName = 'X-Nearhood-District';

		this.$get = [
			'$http',
			function ($http) {
				if (undefined === this.adapter) {
					this.adapter = $http;
				}
				return this;
			}
		];
	};

	var schemeRegex = /^(?:(https|http)\:\/{1,3})/i;
	Server.prototype.genURL = function (url) {
		return schemeRegex.test(url) ? url : this.buildUrl(url);
	};

	Server.prototype.setAdapter = function (adapter) {
		this.adapter = adapter;
		return this;
	};

	Server.prototype.setToken = function (token) {
		this.token = token;
		return this;
	};

	Server.prototype.unsetToken = function (token) {
		this.token = null;
		return this;
	};

	Server.prototype.setDistrict = function(district){
		this.district = district;
		return this;
	};

	Server.prototype.setUserId = function(userid){
		this.userid = userid;
		return this;
	};

	Server.prototype.buildUrl = function (path) {
		path = path.replace(/^\/+/, ''); // remove start path slashes
		return this.host + '/' + path;
	};


	Server.prototype.get = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'get');
	};

	Server.prototype.post = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'post');
	};

	Server.prototype.postForm = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'post', true);
	};

	Server.prototype.put = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'put');
	};

	Server.prototype['delete'] = function (url, data, callback, context) {
		return this.request(url, data, callback, context, 'delete');
	};

	Server.prototype.request = function (url, data, callback, context, method, postForm) {
		var request,
			headers = {
				'Content-Type': 'application/json; charset=utf-8',
				'X-Nearhood-Unique-Id':'123'
			};
		if(window.hasOwnProperty('device')){
			headers['X-Nearhood-Unique-Id']=device.uuid;
		}
		headers[this.headerTokenName] = '';
		if(postForm){
			headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		method = method || 'get';
		context = context || null;
		url = this.genURL(url);
		

		if (typeof url !== 'string') {
			throw new Error('[API Connect]: Invalid or missing URL!\n');
		}


		// Allow data arg to be optional
		if (typeof data === 'function') {
			context = callback;
			callback = data;
			data = {};
		}

		if (this.token){
			headers[this.headerTokenName] = 'token='+this.token;
		}
		if(this.district){
			headers[this.headerDistrictName] = this.district.district_code;
		}
		if(this.userid){
			// headers.userid = this.userid;
		}

		request = {
			method: method,
			url: url,
			data: data,
			headers: headers
		};
		if(request.method.toLowerCase()==='get'){
			request.params = data;
		}
		if(postForm){
			var fd = new FormData();
			for(var o in data){
				fd.append(o,data[o]);
			}
			request.data = fd;
			request.transformRequest = angular.identity;
			request.headers['Content-Type']=undefined;
			request.url = request.url.replace('/api/','/');
			// request.headers.Authorization='';
			// request.transformRequest =function(obj){
			// 	var str = [];
			// 	for(var p in obj){
			// 		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			// 	}
			// 	return str.join("&");
			// }
		}
		return this.adapter(request)
			.success(function (response, status) {
				if(callback!==undefined){
					return callback(response, status);
				}
			})
			.error(function (response, status) {
				if (status === 404){
					throw new Error('404: Not found');
				}
				if (status === 403) {
					throw new Error('403: Forbidden');
				}
				if (status === 500) {
					throw new Error('500: Server error');
				}
				if(callback!==undefined){
					return callback(response, status);
				}
			});
	};

	angular.module('nearhoodApp').provider('Server', Server);
})();