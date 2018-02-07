function timeDeltaInWords() {
    'ngInject';

    return (dateTime) => {
        return moment(dateTime).fromNow();
    }
}

export default timeDeltaInWords;
