function HomeController($scope, $state, TaskService, tasks) {
  'ngInject';

  // const vm = this;  
  $scope.username = 'Michael';

  // $scope.tasklvl = '1';
  $scope.taskLevels = [1,2,3,4]; // TODO: Extract to service || properties file
  $scope.title = null;
  $scope.importance = '1'; // A  

  // Test - check to see if setting each task level on scope then tying to model will automatically update tasks on add - two-way-binding? //
  /*
  $scope.tasksLevel1 = [{
                          "title": "Test task added via dual-binding",
                          "importance": 1,
                          "isActive": false,
                          "status": 0,
                          "createDate": "2017-04-03",
                          "startDate": null,
                          "notes": [],
                          "id": 17
                        }]
  $scope.addTaskTest = (taskLevel) => {
    console.log('addTaskTest()');
    return TaskService.addTask(
      {
        "title": $scope.title,
        "importance": parseInt($scope.importance), // TODO: convert to subtype
        "isActive": false, // Note: task can be started but not currently active (only 1 active at a time)
        "status": 0, // (0: Not Started, 1: In Progress, 2: Paused, 3: Completed),
        "createDate": new Date(Date.now()).toISOString().substring(0, 10),
        "startDate": null,
        "notes": []
      }
    ).then( () => { $scope.tasksLevel1 = TaskService.getTasksAtLevel(1) });
  }
  */
  // /Test //

  $scope.refreshState = () => {
    $state.reload();               
  }

  // TODO: this should be extracted to TasksService and applied to $scope variable
  //       IN A PERFECT WORLD, THIS WOULD AUTOMAGICALLY UPDATE THE UI
  $scope.refreshTasks = () => {
    // // console.log(new Promise( (resolve, reject) => {
      TaskService.getTasks().then( (tasks) => {        
        $scope.sortedTasks = getTasksByImportance(tasks);
      }).then( () => { $state.reload() })    
    }

  $scope.getTasksByImportance = (tasks) => {
    return tasks.reduce( (map, task) => {
      let taskImportance = task["importance"];
      if( !(taskImportance in map) ) { map[taskImportance] = []; }
      map[taskImportance].push(task);
      return map;
    }, {});    
  }

  $scope.sortedTasks = $scope.getTasksByImportance(tasks);

  $scope.addTask = () => {
    return TaskService.addTask(
      {
        "title": $scope.title,
        "importance": parseInt($scope.importance), // TODO: convert to subtype
        "isActive": false, // Note: task can be started but not currently active (only 1 active at a time)
        "status": 0, // (0: Not Started, 1: In Progress, 2: Paused, 3: Completed),
        "createDate": new Date(Date.now()).toISOString().substring(0, 10),
        "startDate": null,
        "notes": []
      }
    ).then( () => { $scope.refreshState() });
    // ).then($scope.$broadcast("REFRESH")); // Not sure how to re-render specific directive in each task-container
  }

  // TODO: Determine how to pass this into task-panel-directive.js and use accordingly
  // $scope.removeTask = (task) => {
  //   console.log('removeTask()');
  //   TaskService.removeTask(task).then($state.transitionTo($state.current, {}, {reload: true}));
  // }

  // TODO: create factory/method to convert task ENUM to value. see notes.txt

}

export default HomeController;
