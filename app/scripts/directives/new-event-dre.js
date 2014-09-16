/* global angular */
(function(){
	function Ctrl ($scope) {
		this.$scope = $scope;
		$scope.message.event_date = new Date();
		$scope.message.event_date.setHours(12);
		$scope.message.event_date.setMinutes(0);

		$scope.message.event_end_date = new Date($scope.message.event_date.getTime()+3600000);
		$scope.message.event_end_date.setHours(23);
		$scope.message.event_end_date.setMinutes(30);

		$scope.message.event_date_until = new Date($scope.message.event_date.getTime()+3600000*7);
		$scope.message.event_date_until.setHours(23);
		$scope.message.event_date_until.setMinutes(30);

		$scope.message.event_recurs_interval='weekly';

		$scope.$on('datesChange',function(){
			$scope.$broadcast('datesChangeEcho');
		});
	};

	Ctrl.prototype.changeHoursStart = function(){
		var hours = this.$scope.hoursStart.split(':');
		this.$scope.message.event_date.setHours(hours[0]);
		this.$scope.message.event_date.setMinutes(hours[1]);
	};

	Ctrl.prototype.changeHoursEnd = function(){
		var hours = this.$scope.hoursEnd.split(':');
		this.$scope.message.event_end_date.setHours(hours[0]);
		this.$scope.message.event_end_date.setMinutes(hours[1]);
	}

	function Directive (gettextCatalog) {
		return {
			restrict:'E',
			controller:['$scope',Ctrl],
			controllerAs:'ctrl',
			templateUrl:'views/partials/new-event.html',
			scope:{
				message:'='
			},
			link:function($scope,el, attr){
				$scope.recurringTypes = [
					{ value:'weekly', name:gettextCatalog.getString('every week') },
					{ value:'biweekly', name:gettextCatalog.getString('every other week') }
				];
				$scope.hoursStart = '12:00';
				$scope.hoursEnd = '23:30';
			}
		}
	}

	angular.module('nearhoodApp').directive('newEvent',['gettextCatalog', Directive]);


	function hoursSelect () {
		return {
			restrict:'A',
			link:function($scope, el, attrs){
				var hour = 0;
				$scope.hoursList = [];
				for(var i=0;i<24*30*2;i+=30){
					$scope.hoursList.push(dnum(Math.floor(i/60))+':'+dnum(i%60));
				}
			}
		}
	}
	angular.module('nearhoodApp').directive('hoursSelect',[hoursSelect]);

	function dnum (num) {
		if(num<10){
			return '0'+num;
		}
		else return num;
	}
})();