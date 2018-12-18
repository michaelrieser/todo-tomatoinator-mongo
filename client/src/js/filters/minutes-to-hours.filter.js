function minutesToHoursFilter() {
    'ngInject';

    return (minutes) => {        
        return (minutes / 60).toFixed(2);
    }
}

export default minutesToHoursFilter;
