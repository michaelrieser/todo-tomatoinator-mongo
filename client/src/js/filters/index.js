import angular from 'angular';

let filtersModule = angular.module('app.filters', []);

import MinutesSeconds from './minutes-seconds.filter';
filtersModule.filter('minutesSeconds', MinutesSeconds);

export default filtersModule;
