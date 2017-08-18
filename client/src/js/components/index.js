import angular from 'angular';

let componentsModule = angular.module('app.components', []);

// Components and Directives
import ListErrors from './list-errors.component';
componentsModule.component('listErrors', ListErrors);

import ShowAuthed from './show-authed.directive';
componentsModule.directive('showAuthed', ShowAuthed);

export default componentsModule;
