class WordsCtrl {
    constructor(Wordnik) {
        'ngInject';

        this._Wordnik = Wordnik;
        this.setWordOfTheDayData();
    }

    setWordOfTheDayData() {
        this.wordOfTheDayData = this._Wordnik.wordOfTheDayData;        
        this.wordOfTheDay = this.wordOfTheDayData.word;
        this.wordOfTheDayDefs = this.wordOfTheDayData.definitions;
    }
}

let Words = {
    bindings: {},
    controller: WordsCtrl,
    templateUrl: 'components/words-helpers/words.html'
};

export default Words;