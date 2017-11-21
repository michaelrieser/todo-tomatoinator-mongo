import angular from 'angular';

// Create the module where our functionality can attach to
let sidebarModule = angular.module('app.sidebar', []);

// Include our UI-Router config settings

// Controllers
import SidebarCtrl from './sidebar.controller';
sidebarModule.controller('SidebarCtrl', SidebarCtrl);

export default sidebarModule;