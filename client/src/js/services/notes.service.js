export default class Notes {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;

  }

  add(task, note) {
    let request = {
      url: `${this._AppConstants.api}/tasks/notes`,
      method: 'POST',
      data: { task: task, note: note }
    };
    return this._$http(request).then((res) => res.data.note);
  }    
}