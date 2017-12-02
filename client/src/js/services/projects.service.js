export default class Projects {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;
  }

  save(project) {
    let request = {
      url: `${this._AppConstants.api}/projects`,
      method: 'POST',
      data: { project: project }
    };
    return this._$http(request).then((res) => res.data.project);
  }

  query(config) {
    // Create the $http object for this request
    let request = {
      url: `${this._AppConstants.api}/projects`,
      method: 'GET'
      // params: config.filters ? config.filters : null // TODO uncomment this for other concrete tasks routes (EX: InProgress/Completed/etc..)
    };
    return this._$http(request).then((res) => res.data);
  }    

  delete(project) {
    console.log(project);
    let request = {
      // TODO: just send task id in url path (?)
      url: `${this._AppConstants.api}/projects/${project.id}`,
      method: 'DELETE'
    }
    return this._$http(request).then((res) => res.data);
  }
}
