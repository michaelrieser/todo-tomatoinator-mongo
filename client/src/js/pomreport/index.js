import angular from 'angular';

// Create the module where our functionality can attach to
let pomreportModule = angular.module('app.pomreport', []);

// Include our UI-Router config settings
import PomreportConfig from './pomreport.config';
pomreportModule.config(PomreportConfig);

// Controllers
import PomreportCtrl from './pomreport.controller';
pomreportModule.controller('PomreportCtrl', PomreportCtrl);

import PomreportDisplayCtrl from './pomreport-display.controller';
pomreportModule.controller('PomreportDisplayCtrl', PomreportDisplayCtrl);


export default pomreportModule;
