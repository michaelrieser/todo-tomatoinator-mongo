function TasksConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.tasks', {
            abstract: true,
            url: '/tasks',
            controller: 'TasksCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks.html',
            resolve: {
                auth: function(User) {                    
                    return User.ensureAuthIs(true);
                }
            }
            // TODO: retrieve all users' tasks and display on splash screen (In-Progress by default)
            // resolve: {
            //     tasks: function(Tasks, $state) {
            //         return Tasks.getAll().then(
            //             (tasks) => tasks,
            //             (err) => $state.go('app.home')
            //         )
            //     }
            // }
        })
        // TODO: create Tasks "splash screen"
        .state('app.tasks.all', {
            url: '',
            controller: 'TasksCtrl', // TODO: create TasksAllCtrl
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-all.html'
        })
        .state('app.tasks.inprogress', {
            url: '/in-progress',
            controller: 'TasksCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-in-progress.html'
            // resolve: {
            // auth: function(User) {
            //     return User.ensureAuthIs(true);
            // }
            // }
        })
        .state('app.tasks.completed', {
          url: '/completed',
          controller: 'TasksCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'tasks/tasks-completed.html'
        })
        .state('app.tasks.team', {
            url: '/team',
            controller: 'TasksCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-team.html'
        })  
        .state('app.tasks.new', {
            url: '/new',
            controller: 'TasksNewCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-new.html'
        })
}

export default TasksConfig;