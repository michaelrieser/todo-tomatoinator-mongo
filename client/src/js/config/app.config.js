import authInterceptor from './auth.interceptor';

function AppConfig($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
  'ngInject';

  // Push our interceptor for auth
  $httpProvider.interceptors.push(authInterceptor);
  
  /*
    If you don't want hashbang routing, uncomment this line.
    Our tutorial will be using hashbang routing though :)
  */
  // $locationProvider.html5Mode(true);

  $stateProvider
  .state('app', {
    abstract: true,
    templateUrl: 'layout/app-view.html',
    resolve: {
      auth: function(User) {        
        return User.verifyAuth();
      }
    }
    // TODO: force resolve to be called w/i changes of the same route hierarchy - for calling User.verifyAuth() -> TaskNotificaions.initializeToast()
    //       to retrieve latest notifications when user changes page ( NOT WORKING, except for Settings route which calls User.ensureAuthIs() -> User.verifyAuth() )
    //       *THIS is probably OK!
    //  *SEE: https://stackoverflow.com/questions/32502445/resolve-not-called-the-second-time
    //  *SEE: https://stackoverflow.com/questions/32284017/ui-router-parents-resolve-not-called-when-state-changes
    // resolve: {
    //   auth: ['User', function(User) {
    //     console.log('app route - verifyAuth()')
    //     return User.verifyAuth();
    //   }]
    // }
  });

  $urlRouterProvider.otherwise('/');

}

export default AppConfig;
