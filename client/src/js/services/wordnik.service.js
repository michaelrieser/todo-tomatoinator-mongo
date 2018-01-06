export default class Wordnik {
    constructor(AppConstants, $http) {
        'ngInject';

        this._$http = $http;
        this._AppConstants = AppConstants;
        this.wordnikBaseUri = 'http://api.wordnik.com:80/v4';
    }

    getWordOfTheDay() {
        let request = {
            url: `${this.wordnikBaseUri}/words.json/wordOfTheDay`,
            method: 'GET',
            params: { api_key: this._AppConstants.apiKeys.wordnik }
        };
        return this._$http(request).then((res) => { this.handleResponse(res) });
    }

    handleResponse(response) {
        this.wordOfTheDayData = response.data;
        return response;
    }
}