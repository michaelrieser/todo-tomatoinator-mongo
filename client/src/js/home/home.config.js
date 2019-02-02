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
                    resolve: {
                        pomtrackerInfo: function (PomTracker, User) {
                            if (!User.current) { return; }
                            return PomTracker.query({ type: 'monthly' }).then(
                                (pomtrackerInfo) => console.log(pomtrackerInfo),
                                (err) => console.log(err)
                            )
                        }
                    }
                },
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

};

export default HomeConfig;
