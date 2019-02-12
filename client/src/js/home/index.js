import angular from 'angular';

// Create the module where our functionality can attach to
let homeModule = angular.module('app.home', []);

// Include our UI-Router config settings
import HomeConfig from './home.config';
homeModule.config(HomeConfig);


// Controllers
import HomeCtrl from './home.controller';
homeModule.controller('HomeCtrl', HomeCtrl);

import HomePomDataCtrl from './home-pom-data.controller';
homeModule.controller('HomePomDataCtrl', HomePomDataCtrl);

export default homeModule;
