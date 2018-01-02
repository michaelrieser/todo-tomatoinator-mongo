class QuotesCtrl {
    constructor() {
        'ngInject';

        this.setQuoteOfTheDayData();
    }

    setQuoteOfTheDayData() {
        // TODO: find viable Quotes API and implement
        this.quoteOfTheDay = 'Our greatest fear is not that we are inadequate, our greatest fear is that we are powerful beyond measure. It is our light, not our darkness that most frightens us.'
        this.quoteOfTheDayAuthor = 'Marianne Williamson';
    }
}

let Quotes = {
    bindings: {},
    controller: QuotesCtrl,
    templateUrl: 'components/quotes-helpers/quotes.html'
};

export default Quotes;