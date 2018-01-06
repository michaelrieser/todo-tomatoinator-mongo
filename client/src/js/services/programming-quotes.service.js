export default class ProgrammingQuotes {
    constructor(AppConstants, $http) {
        'ngInject';

        this._$http = $http;
        this._AppConstants = AppConstants;
        this.quotesBaseUri = 'http://quotes.stormconsultancy.co.uk';
    }

    getRandomQuote() {
        let request = {
            url: `${this.quotesBaseUri}/random.json`,
            method: 'GET'            
        };
        return this._$http(request).then((res) => { return this.handleResponse(res) });
    }

    handleResponse(response) {
        this.randomQuoteData = response.data;        
        return response;
    }
}