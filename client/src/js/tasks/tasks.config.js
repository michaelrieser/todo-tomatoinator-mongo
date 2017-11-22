function TasksConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    // $urlRouterProvider.when('/tasks', '/tasks/all')
    $stateProvider
        /* 3rd iter - one route with params for all tasks and (potentially) abstract routing for sidebar */
        /*    -QUESTION: will state be lost in sidebar when switching between panels? */
        .state('app.tasks', {
                abstract: true,
                views: {
                        '': {
                                templateUrl: 'tasks/tasks.html',
                                controller: 'TasksCtrl',
                                controllerAs: '$ctrl',
                        },
                        'sidebar@app.tasks': { // Fully qualified name - <viewname-in-ui-view>@<statename>
                                templateUrl: 'sidebar/sidebar.html',
                                controller: 'SidebarCtrl',
                                controllerAs: '$ctrl',
                                resolve: {
                                        projectsInfo: function(Projects) {
                                                return Projects.query().then(
                                                        (projectsInfo) => projectsInfo,
                                                        (err) => { console.log('error occurred in Projects.query()'); }
                                                )
                                        },
                                }
                        }
                },
        })
        .state('app.tasks.view', {
                url: '/tasks/:project/:status/',
                params: {
                        status: {
                                value: 'all',
                                // squash configures how a default parameter value is represented in the URL when the current parameter value is the same as the default value. SEE: https://stackoverflow.com/questions/25647454/how-to-pass-parameters-using-ui-sref-in-ui-router-to-controller
                                // allegedly, squash forces default value 'all' to be injected into url if no value given. SEE: http://plnkr.co/edit/r2JhV4PcYpKJdBCwHIWS?p=preview - NOTE: doesn't appear to matter if this is here (?)
                                squash: false
                        },
                        project: {
                                value: 'all',
                                squash: false 
                        }
                }, 
                views: {
                        'tasks': {
                                templateUrl: 'tasks/tasks-display.html',
                                controller: 'TasksDisplayCtrl',
                                controllerAs: '$ctrl',
                                resolve: {
                                        tasksInfo: function(Tasks, $state, $stateParams) {
                                                console.log($stateParams);
                                                console.log($stateParams.project === '');
                                                return Tasks.query($stateParams).then(
                                                        (tasksInfo) => tasksInfo,
                                                        (err) => $state.go('app.home') // TODO: display error message (?)
                                                );
                                        }
                                }
                        },

                }
        })

        //     views: {
        //         '': {
        //             templateUrl: 'tasks/tasks.html',
        //             // controller: 'TasksCtrl', // TODO: DELETE tasks-controller as it is no longer needed
        //             // controllerAs: '$ctrl', 
        //             resolve: {
        //                 auth: function(User) {
        //                     console.log('ensureAuthIs..')
        //                     return User.ensureAuthIs(true);
        //                 }
        //             }
        //         },
        //         'sidebar': {
        //             templateUrl: '<p>Sidebar</p>'
        //         }
        //     }
        

        /* 2nd iter - abstract tasks working but abstract sidebar not so much - NOT SURE IF multiple abstract routes possible */
        /*      -QUESTION: possible to have abstract + concrete routes for each but only change .state String, NOT url path? */
        /*                 *could potentially have one abstract index route and set default/initial view for tasks and sidebar
        // .state('app.tasks', {
        //     abstract: true,
        //     url: '/tasks',
        //     views: {
        //         '': {
        //             templateUrl: 'tasks/tasks.html',
        //             // controller: 'TasksCtrl', // TODO: DELETE tasks-controller as it is no longer needed
        //             // controllerAs: '$ctrl', 
        //             resolve: {
        //                 auth: function(User) {
        //                     console.log('ensureAuthIs..')
        //                     return User.ensureAuthIs(true);
        //                 }
        //             }
        //         },
        //         // 'sidebar': {
        //         //     templateUrl: '<p>Sidebar</p>'
        //         // }
        //     }
        // })
        // .state('app.tasks.all', { 
        //     url: '',
        //     views: {
        //         'tasks@app.tasks': { // <name-in-ui-view-directive>@<name-in-state> 
        //             controller: 'TasksAllCtrl',
        //             controllerAs: '$ctrl',
        //             templateUrl: 'tasks/tasks-all.html',
        //             title: 'All',
        //         },
        //         'sidebar@app.tasks': {  // WORKS!
        //             // templateUrl: '<projects projects="$ctrl.projects"></projects>'
        //             template: '<p>Sidebar</p>',
        //             // controller:
        //         }
        //     },
        //     resolve: { // must have resolve here instead of abstract to ensure tasks are updated after new task added
        //         tasksInfo: function(Tasks, $state) {
        //             return Tasks.query().then(
        //                 (tasksInfo) => tasksInfo,
        //                 (err) => $state.go('app.home') // TODO: display error message (?)
        //             );
        //         }
        //     }            
        // })
        // .state('<not-sure-what-to-put-for-sidebar-this-isnt-gonna-work-is-it')
        // .state('app.tasks.completed', { 
        //     url: '/completed',
        //     views: {
        //         'tasks@app.tasks': { // <name-in-ui-view-directive>@<name-in-state> 
        //             url: '/all',
        //             controller: 'TasksAllCtrl',
        //             controllerAs: '$ctrl',
        //             templateUrl: 'tasks/tasks-all.html',
        //             title: 'All',
        //         }
        //     },
        //     resolve: { // must have resolve here instead of abstract to ensure tasks are updated after new task added
        //         tasksInfo: function(Tasks, $state) {
        //             return Tasks.query().then(
        //                 (tasksInfo) => tasksInfo,
        //                 (err) => $state.go('app.home') // TODO: display error message (?)
        //             );
        //         }
        //     }            
        // })

        /* 1st iter */
                // .state('app.tasks', {
                //     abstract: true,
                //     url: '/tasks',
                //     controller: 'TasksCtrl',
                //     controllerAs: '$ctrl',
                //     templateUrl: 'tasks/tasks.html',
                //     resolve: {
                //         auth: function(User) {                    
                //             return User.ensureAuthIs(true);
                //         },
                //         projects: function(Projects, $state) {
                //             return Projects.query().then(
                //                 (projects) => projects,
                //                 (err) => console.log(err)
                //             )
                //         }s
                //     }
                // })
                
                // .state('app.tasks.all', {
                //     url: '',
                //     controller: 'TasksAllCtrl', 
                //     controllerAs: '$ctrl',
                //     templateUrl: 'tasks/tasks-all.html',
                //     title: 'All',
                //     resolve: { // must have resolve here instead of abstract to ensure tasks are updated after new task added
                //         tasksInfo: function(Tasks, $state) {
                //             return Tasks.query().then(
                //                 (tasksInfo) => tasksInfo,
                //                 (err) => $state.go('app.home') // TODO: display error message (?)
                //             );
                //         }
                //     }
                // })
        // .state('app.tasks.inprogress', {
        //     url: '/in-progress',
        //     controller: 'TasksCtrl',
        //     controllerAs: '$ctrl',
        //     templateUrl: 'tasks/tasks-in-progress.html',
        //     title: 'In Progress'
        // })
        // .state('app.tasks.completed', {
        //   url: '/completed',
        //   controller: 'TasksCtrl',
        //   controllerAs: '$ctrl',
        //   templateUrl: 'tasks/tasks-completed.html',
        //   title: 'Completed'
        // })
        // .state('app.tasks.team', {
        //     url: '/team',
        //     controller: 'TasksCtrl',
        //     controllerAs: '$ctrl',
        //     templateUrl: 'tasks/tasks-team.html',
        //     title: 'Team'
        // })  
        // .state('app.tasks.new', {
        //     url: '/new',
        //     controller: 'TasksNewCtrl',
        //     controllerAs: '$ctrl',
        //     templateUrl: 'tasks/tasks-new.html',
        //     title: 'New',
        //     resolve: {
        //         tasksInfo: function(Tasks, $state) {
        //             return Tasks.query().then(
        //                 (tasksInfo) => tasksInfo,
        //                 (err) => $state.go('app.home') // TODO: display error message (?)
        //             );
        //         }
        //     }
        // })
        
}

export default TasksConfig;