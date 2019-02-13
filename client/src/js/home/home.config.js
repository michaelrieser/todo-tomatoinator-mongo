function HomeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.home', {
            abstract: true,
            views: {
                '': {
                    controller: 'HomeCtrl as $ctrl',
                    templateUrl: 'home/home.html'
                },
                // TODO: set app.home as abstract parent and extract signup@app.home to concrete child route 
                //       to ALLOW USER TO SIGN IN FROM HOME PAGE INSTEAD OF HAVING TO REDIRECT
                // *NOTE: extending auth component turned out to be more trouble than it was worth - just using standalone template
                'signup@app.home': {
                    controller: 'AuthCtrl as $ctrl',
                    templateUrl: 'auth/auth.html',
                    resolve: {
                        // must eplicitly pass 'register' || 'login' to AuthCtrl if not instantiating from auth.config route
                        authTypeOverride: function () { return 'register'; }
                    }
                }
            }
        })
        .state('app.home.view', {
            // url: '/:type?offset', // *NOTE/WARNING: setting params in url (i.e. :type) for home state caused other state's url (ex: /settings) to be used for :type
            url: '/?offset',            
            params: {
                type: 'weekly', // default to 'weekly' - NOTE: use 'squash: true' to remove param from url if default is set
            },            
            views: {
                'homepomdata': {
                    controller: 'HomePomDataCtrl as $ctrl',
                    templateUrl: 'home/home-pom-data.html',
                    resolve: {
                        pomtrackerInfo: function (PomTrackerHome, User, $stateParams) {
                            // console.log($stateParams)
                            if (!User.current) { return; }
                            return PomTrackerHome.queryAndSet($stateParams).then(                                
                                (pomtrackerInfo) => pomtrackerInfo,
                                (err) => console.log(err)
                            )
                        }
                    }
                }
            },
            title: 'Home'          
        })
};

export default HomeConfig;
