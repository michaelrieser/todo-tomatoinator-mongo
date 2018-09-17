import angular from 'angular';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

// Services
import UserService from './user.service';
servicesModule.service('User', UserService);

import JwtService from './jwt.service';
servicesModule.service('JWT', JwtService);

import TasksService from './tasks.service';
servicesModule.service('Tasks', TasksService);

import NotesService from './notes.service';
servicesModule.service('Notes', NotesService);

import StepsService from './steps.service';
servicesModule.service('Steps', StepsService);

import ProjectsService from './projects.service';
servicesModule.service('Projects', ProjectsService);

import PomTimerService from './pom-timer.service';
servicesModule.service('PomTimer', PomTimerService);

import PomTrackerService from './pom-tracker.service';
servicesModule.service('PomTracker', PomTrackerService);

import WordnikService from './wordnik.service';
servicesModule.service('Wordnik', WordnikService);

import ProgrammingQuotesService from './programming-quotes.service';
servicesModule.service('ProgrammingQuotes', ProgrammingQuotesService);

import TaskNotificationsService from './task-notifications.service';
servicesModule.service('TaskNotifications', TaskNotificationsService);

import TimeUtilsService from './time-utils.service';
servicesModule.service('TimeUtils', TimeUtilsService);

import ProjectPanelService from './project-panel.service';
servicesModule.service('ProjectPanel', ProjectPanelService);

export default servicesModule;
