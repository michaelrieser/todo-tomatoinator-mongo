import angular from 'angular';

let componentsModule = angular.module('app.components', []);

// Directives
import ShowAuthed from './show-authed.directive';
componentsModule.directive('showAuthed', ShowAuthed);

import UiSortable from './ui-sortable.directive';
componentsModule.directive('uiSortable', UiSortable);

import ShowFocus from './show-focus.directive';
componentsModule.directive('showFocus', ShowFocus);

// Components
import ListErrors from './list-errors.component';
componentsModule.component('listErrors', ListErrors);

import TaskNavbar from './task-helpers/task-navbar.component';
componentsModule.component('taskNavbar', TaskNavbar);

import TaskList from './task-helpers/task-list.component';
componentsModule.component('taskList', TaskList);

import Task from './task-helpers/task.component';
componentsModule.component('task', Task);

import AddTaskForm from './task-helpers/add-task-form.component';
componentsModule.component('addTaskForm', AddTaskForm);

import TaskNotes from './task-helpers/task-notes.component';
componentsModule.component('taskNotes', TaskNotes);

import TaskNote from './task-helpers/task-note.component';
componentsModule.component('taskNote', TaskNote);

import TaskChecklist from './checklist-helpers/task-checklist.component';
componentsModule.component('taskChecklist', TaskChecklist);

import ChecklistStep from './checklist-helpers/checklist-step.component';
componentsModule.component('checklistStep', ChecklistStep);

import PomTimer from './pom-timer.component';
componentsModule.component('pomTimer', PomTimer);

import Projects from './project-helpers/projects.component';
componentsModule.component('projects', Projects);

import Project from './project-helpers/project.component';
componentsModule.component('project', Project);

import Words from './words-helpers/words.component';
componentsModule.component('words', Words);

import Quotes from './quotes-helpers/quotes.component';
componentsModule.component('quotes', Quotes);

export default componentsModule;
