/* global angular, Pikaday, moment */
(function(){
	'use strict';
	function pikaday (language) {
		return {
			scope:{
				mindate:'=',
				date:'='
			},
			link:function($scope, el){
				var config={
					firstDay:1,
					field:el[0],
					onSelect:function(){
						el[0].innerHTML=this.getMoment().format('D.M.');
						var date = this.getMoment().toDate();
						$scope.date.setYear(date.getFullYear());
						$scope.date.setMonth(date.getMonth());
						$scope.date.setDate(date.getDate());
						$scope.$emit('datesChange');
					}
				}
				if($scope.mindate){
					config.minDate = $scope.mindate;
				}

				$scope.$on('datesChangeEcho',function(){
					if($scope.date.getTime()<$scope.mindate.getTime()){
						$scope.date.setYear($scope.mindate.getFullYear());
						$scope.date.setMonth($scope.mindate.getMonth());
						$scope.date.setDate($scope.mindate.getDate());
						el[0].innerHTML = moment($scope.date).format('D.M.');
					}
					pikaday.setMinDate($scope.mindate.getTime()-86400000);
				});

				if(language.state.currentLanguage==='fi_FI'){
					config.i18n= {
						previousMonth : 'Edellinen kuukausi',
					    nextMonth     : 'ensi kuussa',
					    months        : ['Tammikuu','Helmikuu', 'Maaliskuu', 'Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
					    weekdays      : ['Sunnuntain', 'maanantaina', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
					    weekdaysShort : ['Su','Ma','Ti','Ke','To','Pe','La']
					}
				}

				el[0].innerHTML = moment($scope.date).format('D.M.');
				$scope.$on('$stateChangeStart',function(){
					pikaday.hide();
				})
				var pikaday = new Pikaday(config);
			}
		}
	}
	angular.module('nearhoodApp').directive('pikaday',['language',pikaday]);
})();