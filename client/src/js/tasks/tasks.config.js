function TasksConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.tasks', {
            abstract: true,
            url: '/tasks',
            controller: 'TasksCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks.html'
            // resolve: {
            //     tasks: function(Tasks, $state) {
            //         return Tasks.getAll().then(
            //             (tasks) => tasks,
            //             (err) => $state.go('app.home')
            //         )
            //     }
            // }
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
            controller: 'TasksCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-new.html'
        })
}

export default TasksConfig;