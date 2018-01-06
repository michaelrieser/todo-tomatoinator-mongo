class QuotesCtrl {
    constructor(ProgrammingQuotes) {
        'ngInject';

        this._ProgrammingQuotes = ProgrammingQuotes;
        this.setRandomQuoteData();
    }

    setRandomQuoteData() {
        this.randomDevQt = this._ProgrammingQuotes.randomQuoteData.quote;
        this.randomDevQtAuthor = this._ProgrammingQuotes.randomQuoteData.author;
    }
}

let Quotes = {
    bindings: {},
    controller: QuotesCtrl,
    templateUrl: 'components/quotes-helpers/quotes.html'
};

export default Quotes;