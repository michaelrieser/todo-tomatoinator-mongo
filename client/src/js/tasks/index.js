import angular from 'angular';

// Create the module where our functionality can attach to
let tasksModule = angular.module('app.tasks', []);

// Include our UI-Router config settings
import TasksConfig from './tasks.config';
tasksModule.config(TasksConfig);

// Controllers
import TasksCtrl from './tasks.controller';
tasksModule.controller('TasksCtrl', TasksCtrl);

export default tasksModule;