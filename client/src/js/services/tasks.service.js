export default class Tasks {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;


  }

  save(task) {
    let request = {
      url: `${this._AppConstants.api}/tasks`,
      method: 'POST',
      data: { task: task }
    };

    return this._$http(request).then((res) => res.data.task);
  }

  query(config) {
    // Create the $http object for this request
    let request = {
      url: `${this._AppConstants.api}/tasks`,
      method: 'GET'
      // params: config.filters ? config.filters : null // TODO uncomment this for other concrete tasks routes (EX: InProgress/Completed/etc..)
    };
    // console.log(this._$http(request).then((res) => console.log(`service: ${res.data.highestOrderNumber}`)));
    return this._$http(request).then((res) => res.data);
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