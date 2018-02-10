import angular from 'angular';

// Create the module where our functionality can attach to
let toastModule = angular.module('app.toast', []);

// Controllers
import ToastCtrl from './toast.controller';
toastModule.controller('ToastCtrl', ToastCtrl);

export default toastModule;