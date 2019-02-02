function HomeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.home', {
      url: '/',
      title: 'Home',
      views: {
        '': {
          controller: 'HomeCtrl as $ctrl',
          templateUrl: 'home/home.html',
        },
        'signup@app.home': {
          controller: 'AuthCtrl as $ctrl',
          templateUrl: 'auth/auth.html',
          resolve: {
            authTypeOverride: function () { return 'register'; }
          }
        }
      }
    })

};

export default HomeConfig;
