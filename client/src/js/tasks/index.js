import angular from 'angular';

// Create the module where our functionality can attach to
let tasksModule = angular.module('app.tasks', []);

// Include our UI-Router config settings
import TasksConfig from './tasks.config';
tasksModule.config(TasksConfig);

// Controllers
import TasksCtrl from './tasks.controller';
tasksModule.controller('TasksCtrl', TasksCtrl);

import TasksDisplayCtrl from './tasks-display.controller.js';
tasksModule.controller('TasksDisplayCtrl', TasksDisplayCtrl);

// import TasksAllCtrl from './tasks-all.controller';
// tasksModule.controller('TasksAllCtrl', TasksAllCtrl);

// import TasksNewCtrl from './tasks-new.controller';
// tasksModule.controller('TasksNewCtrl', TasksNewCtrl);

export default tasksModule;