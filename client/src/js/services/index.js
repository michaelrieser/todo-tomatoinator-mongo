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

import ProjectsService from './projects.service';
servicesModule.service('Projects', ProjectsService);

export default servicesModule;
