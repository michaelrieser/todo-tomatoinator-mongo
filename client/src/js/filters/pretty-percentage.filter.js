function prettyPercentageFilter() {
    'ngInject';

    return (rawPercentage) => {        
        // return `${rawPercentage.toFixed(2)}%`;
        return `${Math.round(rawPercentage)}%`;        
    }
}

export default prettyPercentageFilter;
