function TasksConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.tasks', {
            abstract: true,
            url: '/tasks',
            // controller: 'TasksCtrl', // TODO: this is never used!
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks.html',
            resolve: {
                auth: function(User) {                    
                    return User.ensureAuthIs(true);
                }
            }
        })
        
        .state('app.tasks.all', {
            url: '',
            controller: 'TasksAllCtrl', 
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-all.html',
            title: 'All',
            resolve: { // must have resolve here instead of abstract to ensure tasks are updated after new task added
                tasksInfo: function(Tasks, $state) {
                    return Tasks.query().then(
                        (tasksInfo) => tasksInfo,
                        (err) => $state.go('app.home') // TODO: display error message (?)
                    );
                }
            }
        })
        .state('app.tasks.inprogress', {
            url: '/in-progress',
            controller: 'TasksCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-in-progress.html',
            title: 'In Progress'
        })
        .state('app.tasks.completed', {
          url: '/completed',
          controller: 'TasksCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'tasks/tasks-completed.html',
          title: 'Completed'
        })
        .state('app.tasks.team', {
            url: '/team',
            controller: 'TasksCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-team.html',
            title: 'Team'
        })  
        .state('app.tasks.new', {
            url: '/new',
            controller: 'TasksNewCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'tasks/tasks-new.html',
            title: 'New',
            resolve: {
                tasksInfo: function(Tasks, $state) {
                    return Tasks.query().then(
                        (tasksInfo) => tasksInfo,
                        (err) => $state.go('app.home') // TODO: display error message (?)
                    );
                }
            }
        })
}

export default TasksConfig;