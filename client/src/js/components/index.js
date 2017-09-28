import angular from 'angular';

let componentsModule = angular.module('app.components', []);

// Components and Directives
import ListErrors from './list-errors.component';
componentsModule.component('listErrors', ListErrors);

import ShowAuthed from './show-authed.directive';
componentsModule.directive('showAuthed', ShowAuthed);

import TaskList from './task-helpers/task-list.component';
componentsModule.component('taskList', TaskList);

import Task from './task-helpers/task.component';
componentsModule.component('task', Task);

import TaskNotes from './task-helpers/task-notes.component';
componentsModule.component('taskNotes', TaskNotes);

import TaskNote from './task-helpers/task-note.component';
componentsModule.component('taskNote', TaskNote);

export default componentsModule;
