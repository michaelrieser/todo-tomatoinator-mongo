export default class TimeUtils {
    constructor(AppConstants) {
        'ngInject';

        this._AppConstants = AppConstants;
    }

    dateTimeInPast(targetDateTime) {
        let now = moment(); 
        let targetDateTimeMoment = moment(targetDateTime);
        return now.isAfter(targetDateTimeMoment);
    }

    colorBasedOnTimeRemaining(targetDateTime) {
        let appConstants = this._AppConstants;
        let now = moment();
        let targetMoment = moment(targetDateTime);

        let timeDeltaInMilliseconds = targetMoment.diff(now);
        if (timeDeltaInMilliseconds < 0) {
            return 'red';
        } else if (timeDeltaInMilliseconds <= appConstants.oneHourInMilliseconds) {
            return 'red-orange';
        } else if (timeDeltaInMilliseconds <= appConstants.twelveHoursInMilliseconds) {
            return 'orange';
        } else if (timeDeltaInMilliseconds <= appConstants.dayInMilliseconds) {
            return 'yellow-orange';
        } else {
            return 'black';
        }
    }
}
