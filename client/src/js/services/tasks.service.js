export default class Tasks {
  constructor(AppConstants, $http) {
    'ngInject';

    console.log('Tasks instantiated!');
    // this.tasksInfo = undefined;
    // this.activeTask = undefined;
    // this.tasks = undefined;
    // QUESTION: call query when Tasks instantiated? *would this result in race condition with route/controllers/etc...?

    this._AppConstants = AppConstants;
    this._$http = $http;

    this.currentlySetFilters = {}; // TODO: hook this into local session storage
  }

  save(task) {
    let request = {
      url: `${this._AppConstants.api}/tasks`,
      method: 'POST',
      data: { task: task }
    };

    return this._$http(request).then((res) => res.data.task);
  }

  query(stateParams={}) {
    var testParams = {};

    var queryConfig = {};
    // NOTE: before queryConfig.filters was set to {} if stateParams === {}, but this resulted in all tasks being displayed when query called with no params, changed to this.currentlySetFilters
    queryConfig.filters = angular.equals(stateParams, {}) ? this.currentlySetFilters : this.getMergedFilters(stateParams);

    // Create the $http object for this request
    let request = {
      url: `${this._AppConstants.api}/tasks`,
      method: 'GET',
      params: queryConfig.filters ? queryConfig.filters : null // TODO uncomment this for other concrete tasks routes (EX: InProgress/Completed/etc..)
    };
    // console.log(this._$http(request).then((res) => console.log(`service: ${res.data.highestOrderNumber}`)));
    // return this._$http(request).then((res) => res.data);
    return this._$http(request).then((res) => { return this.handleQueryResponse(res.data) });
  }

  handleQueryResponse(tasksInfo) {
    // TODO - use setRefreshedTasks() here for tasks & activeTask ??
    this.tasksInfo = tasksInfo;
    this.tasks = this.getInactiveTasks(this.tasksInfo.tasks);
    this.activeTask = this.getActiveTask(this.tasksInfo.tasks)
    this.taskCount = this.tasksInfo.tasksCount;
    // this.tasks = tasksInfo.tasks;
    return tasksInfo; // TODO: return object containing {activeTask, tasks, taskCount, etc.. for tasks-display.controller.js and elsewhere}
  }

  refreshTasks() {
      this.query().then(
          (tasksInfo) => this.setRefreshedTasks(tasksInfo.tasks),
          (err) => $state.go('app.home') // TODO: display error message (?)
      );        
  }
  setRefreshedTasks(tasks) { // Note: this functionality couldn't be implemented in refreshTasks() success method ('this' was inaccessible)     
      this.activeTask = this.getActiveTask(tasks);
      this.tasks = this.getInactiveTasks(tasks);
  }

  clearObject(targetObject) {
    for (var key in targetObject) {
      if (targetObject.hasOwnProperty(key)) {
        delete targetObject[key];
      }
    }
    console.log(targetObject);
  }

  copyObject(srcObject, destObject) {
    for (var prop in srcObject) destObject[prop] = srcObject[prop];
    console.log('destObject');
    console.log(destObject);
  }

  getActiveTask(tasks) {
      return tasks.find( (task) => { return task.isActive; });
  }

  getInactiveTasks(tasks) {
      return tasks.filter( (task) => { if (!task.isActive) { return task; }});
  }

  toggleTaskActive(task) {
    console.log('toggleTaskActive()');
    if (this.activeTask && !task.isActive) { // Not currently active task
        this.activeTask.isActive = false;
        this.update(this.activeTask).then(
            (success) => {
                task.isActive = true;
                this.update(task).then(
                    (success) => {
                        // TODO: handle setting of new activeTask and relegating previously activeTask to inactive list in FRONTEND w/o refreshTasks service calls
                        // console.log(this.tasks.indexOf(task));
                        // var tgtActiveTaskIdx = this.tasks.indexOf(task);
                        // this.activeTask = this.tasks.splice(tgtActiveTaskIdx, 1); // Remove task from inactive list and set to activeTask
                        this.refreshTasks();
                    },
                    (failure) => console.log('toggleTaskActive failed')
                )
            },
            (failure) => {
                console.log('toggleTaskActive failed');
            }
        )
    } else if (!this.activeTask) { // No currently active task
        task.isActive = true;
        this.update(task).then(
            (success) => {
                var tgtActiveTaskIdx = this.tasks.indexOf(task);
                this.activeTask = this.tasks.splice(tgtActiveTaskIdx, 1)[0];
            },
            (failure) => console.log('toggleTaskActive failed')
        ) 
    } else if (task.isActive) { // Currently active task
        task.isActive = false;
        this.update(task).then(
            (success) => this.refreshTasks(), // TODO: place note based off of whether it is completed
            (failure) => console.log('toggleTaskActive() failed')
        )
    }
  }

  getMergedFilters(stateParams = {}) {
    this.setStatusFilterFromString(stateParams.status);
    this.setProjectFilterFromString(stateParams.project);
    return this.currentlySetFilters;
  }

  setStatusFilterFromString(targetStatus) {
    if (targetStatus === undefined) { return; } // TODO: this could probably be deleted since default params are used in ui-router

    switch (targetStatus) {
      case 'all':
        delete this.currentlySetFilters.isComplete;
        break;
      case 'in-progress':
        this.currentlySetFilters.isComplete = false;
        break;
      case 'completed':
        this.currentlySetFilters.isComplete = true;
        break;
      case 'team':
        // TODO: not sure what we're doing here yet!
        break;
    }    
  }

  setProjectFilterFromString(targetProject) {
    if (targetProject === undefined) { return; } // TODO: this could probably be deleted since default params are used in ui-router

    if (targetProject === 'all') delete this.currentlySetFilters.project;
    else this.currentlySetFilters.project = targetProject;
  }

  delete(task) {
    let request = {
      // TODO: just send task id in url path (?)
      url: `${this._AppConstants.api}/tasks/${task.id}`,
      method: 'DELETE'
    }
    return this._$http(request).then((res) => res.data);
  }

  update(task) {
    let request = {
      url: `${this._AppConstants.api}/tasks/update`,
      method: 'PUT',
      data: { task: task } // => becomes req.body.task in tasks.js route
    }
    return this._$http(request).then((res) => res.data);
  }
}