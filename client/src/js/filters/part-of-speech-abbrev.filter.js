function partOfSpeechAbbrevFilter() {
    'ngInject';

    return (fullWord) => {
        switch (fullWord) {
            case 'noun':
                return 'n.';
                break;
            case 'verb':
                return 'v.';
                break;
            case 'adjective':
                return 'adj.';
                break;
            case 'adverb':
                return 'adv.';
                break;
            case 'pronoun':
                return 'pron.';
                break;
            case 'preposition':
                return 'prep.';
                break;
            case 'conjunction':
                return 'conj.';
                break;
            case 'interjection':
                return 'interj.';
                break;
            default:
                return fullWord;
                break;
        }
    }
}

export default partOfSpeechAbbrevFilter;