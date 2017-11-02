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
}
