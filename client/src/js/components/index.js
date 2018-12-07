import angular from 'angular';

let componentsModule = angular.module('app.components', []);

// Directives
import ShowAuthed from './show-authed.directive';
componentsModule.directive('showAuthed', ShowAuthed);

import UiSortable from './ui-sortable.directive';
componentsModule.directive('uiSortable', UiSortable);

import ShowFocus from './show-focus.directive';
componentsModule.directive('showFocus', ShowFocus);

import DateTimePicker from './date-time-picker.directive';
componentsModule.directive('dateTimePicker', DateTimePicker);

import PluralizeTimePeriod from './pluralize-time-period.directive';
componentsModule.directive('pluralizeTimePeriod', PluralizeTimePeriod);

import AutoHeight from './auto-height.directive';
componentsModule.directive('autoHeight', AutoHeight);

// *** NOTE: decision was made to just dynamically set height of pomreport completion display boxes via ng-style directives in pomreport-interval.html *** //
// ***       LEAVING FOR REFERENCE/FUTURE REFACTOR                   
// import PomreportCompletionDisplay from './pomreport-helpers/pomreport-completion-display.directive';
// componentsModule.directive('PomreportCompletionDisplay', PomreportCompletionDisplay);

// Components
import MainNavbarLinks from './main-navbar-links.component';
componentsModule.component('mainNavbarLinks', MainNavbarLinks);

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

import NoteTitle from './note-helpers/note-title.component';
componentsModule.component('noteTitle', NoteTitle);

import ChecklistStep from './checklist-helpers/checklist-step.component';
componentsModule.component('checklistStep', ChecklistStep);

import ChecklistStepTitle from './checklist-helpers/checklist-step-title.component';
componentsModule.component('checklistStepTitle', ChecklistStepTitle);

import PomTimer from './pom-timer.component';
componentsModule.component('pomTimer', PomTimer);

import Projects from './project-helpers/projects.component';
componentsModule.component('projects', Projects);

import ProjectList from './project-helpers/project-list.component';
componentsModule.component('projectList', ProjectList);

import AddProjectForm from './project-helpers/add-project-form.component';
componentsModule.component('addProjectForm', AddProjectForm);

import ProjectPanelCtrl from './project-helpers/project-panel.controller';
componentsModule.controller('ProjectPanelCtrl', ProjectPanelCtrl)

import Project from './project-helpers/project.component';
componentsModule.component('project', Project);

import Words from './words-helpers/words.component';
componentsModule.component('words', Words);

import Quotes from './quotes-helpers/quotes.component';
componentsModule.component('quotes', Quotes);

import TaskDueDateTimeInput from './task-helpers/task-due-date-time-input.component';
componentsModule.component('taskDueDateTimeInput', TaskDueDateTimeInput);

import TaskDueDateTimeInputForm from './task-helpers/task-due-date-time-input-form.component';
componentsModule.component('taskDueDateTimeInputForm', TaskDueDateTimeInputForm);

import TaskReminderDateTimeInput from './task-helpers/task-reminder-date-time-input.component';
componentsModule.component('taskReminderDateTimeInput', TaskReminderDateTimeInput);

import TaskReminderDateTimeInputForm from './task-helpers/task-reminder-date-time-input-form.component';
componentsModule.component('taskReminderDateTimeInputForm', TaskReminderDateTimeInputForm);

import DueNotification from './notification-helpers/due-notification.component';
componentsModule.component('dueNotification', DueNotification);

import ReminderNotification from './notification-helpers/reminder-notification.component';
componentsModule.component('reminderNotification', ReminderNotification);

import NotificationDateTimeInput from './notification-helpers/notification-date-time-helpers/notification-date-time-input.component';
componentsModule.component('notificationDateTimeInput', NotificationDateTimeInput);

import TestComponent from './task-helpers/test-component.component';
componentsModule.component('testComponent', TestComponent);

import PomreportNavbar from './pomreport-helpers/pomreport-navbar.component';
componentsModule.component('pomreportNavbar', PomreportNavbar);

import PomreportInterval from './pomreport-helpers/pomreport-interval.component';
componentsModule.component('pomreportInterval', PomreportInterval);

import PomreportSummaryDaily from './pomreport-helpers/pomreport-summary-daily.component';
componentsModule.component('pomreportSummaryDaily', PomreportSummaryDaily)

export default componentsModule;
