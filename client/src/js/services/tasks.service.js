// TODO: copied from 'Creating the article editor' - adjust to use for tasks!
export default class Tasks {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;


  }

  // TODO: repurpose Article functionality for Tasks
  save(task) {
    let request = {
      url: `${this._AppConstants.api}/tasks`,
      method: 'POST',
      data: { task: task }
    };

    return this._$http(request).then((res) => res.data.task);
  }

  getAll() {
      console.log('TODO - create & wire up backend routes and return tasks (w/notes) for current user');
  };
}