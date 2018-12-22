// SEE: https://stackoverflow.com/questions/48642013/angularjs-convert-minutes-to-days-hours-and-minutes-with-a-filter
function minutesToDaysHoursMinutesFilter() {
    'ngInject';

    return (input) => {        
        
        // set minutes to seconds
        let seconds = input * 60;

        // calc (and subtract) whole days
        let days = Math.floor(seconds / 86400);
        seconds -= days * 86400;

        // calc (and subtract) whole hours
        let hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;

        // calc (and subtract) whole minutes
        let minutes = Math.floor(seconds / 60);

        return `${days}d ${hours}h ${minutes}m`;
    }
}

export default minutesToDaysHoursMinutesFilter;
