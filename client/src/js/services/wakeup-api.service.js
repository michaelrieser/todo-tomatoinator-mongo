export default class WakeupApi {
    constructor($http, AppConstants) {
        'ngInject';

        this._$http = $http;
        this._AppConstants = AppConstants;
    }    

    pingServer() {
        let request = {
            url: `${this._AppConstants.api}/ping`,
            method: 'GET'
        }
        return this._$http(request).then((res) => { console.log(res) });
    }
}