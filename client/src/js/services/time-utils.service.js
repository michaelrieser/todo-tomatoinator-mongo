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
    getSuggestedTgtReminderDateTime(reminderIntervalNumber, reminderIntervalPeriod) {
        let tgtReminderDateTime = moment().add(reminderIntervalNumber, reminderIntervalPeriod)
        // round up to nearest hour - SEE: https://stackoverflow.com/questions/17691202/round-up-round-down-a-momentjs-moment-to-nearest-minute
        !reminderIntervalPeriod.includes('hour') && ( tgtReminderDateTime.minute() || tgtReminderDateTime.second() || tgtReminderDateTime.millisecond() ) 
            ? tgtReminderDateTime.add(1, 'hour').startOf('hour') // add 1 hour if 'monthly' || weekly' || 'daily' ('hourly' already adds)
            : tgtReminderDateTime.startOf('hour');
        return tgtReminderDateTime;
    } 
}
