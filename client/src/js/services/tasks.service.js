// TODO: copied from 'Creating the article editor' - adjust to use for tasks!
export default class Tasks {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;


  }

  save(task) {
    console.log(task);
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

  query(config) {
    // Create the $http object for this request
    let request = {
      url: `${this._AppConstants.api}/tasks`,
      method: 'GET'
      // params: config.filters ? config.filters : null
    };
    // console.log(this._$http(request).then((res) => console.log(`service: ${res.data.highestOrderNumber}`)));
    return this._$http(request).then((res) => res.data);
  }

  toggleTaskNotes(task) {
    let request = {
      url: `${this._AppConstants.api}/tasks/update`,
      method: 'PUT',
      data: { task: task } // => becomes req.body.task in tasks.js route
    }
    return this._$http(request).then((res) => res.data);
  }
  
}