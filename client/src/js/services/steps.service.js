export default class Steps {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;

  }

  add(step) {
    let request = {
      url: `${this._AppConstants.api}/steps`,
      method: 'POST',
      data: { step: step }
    };
    return this._$http(request).then((res) => res.data.step);
  }

  delete(stepID) {
    let request = {
      url: `${this._AppConstants.api}/steps/${stepID}`,
      method: 'DELETE'
    };  
    return this._$http(request).then((res) => res.data);
  }

  query(queryConfig = {}) {
    let request = {
      url: `${this._AppConstants.api}/steps`,
      method: 'GET',
      params: queryConfig.filters ? queryConfig.filters : null
    }
    return this._$http(request).then((res) => res.data );
  }

  update(step) {
    let request = { 
      url: `${this._AppConstants.api}/steps`,
      method: 'PUT',
      data: { step: step }
    };
    return this._$http(request).then((res) => res.data);
  }
}
