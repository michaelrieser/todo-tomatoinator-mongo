function dateTimePicker() {
    'ngInject';
    
    return {
        restrict: "A",
        scope: {
            onEnterKeypress: '&'
        },
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {            
            // NOTE: Valid Moment Date instantiation (with format): moment('2018-02-09T05:00:00.000Z', 'YYYY/MM/DD, h:mm a')
            //       Instantiating Moment Date with format 'MMMM Do YYYY, h:mm a' is not valid
            var parent = $(element).parent();            
            var dtp = parent.datetimepicker({
                keyBinds: {
                    enter: function() {
                        element.blur();
                    }
                },
                useCurrent: false, // sets date to null || existing dueDateTime when datetimepicker loaded, fixes datetimepicker vanishing when calendar clicked on task  
                defaultDate: moment().add(1, 'hour').startOf('hour').format(attrs.format),                 
                format: attrs.dateTimePicker,
                showClear: true
            });         
            
            // added dp.show to update model when user elects suggested date time
            // **TODO: still doesn't update input on load! => MAYBE THAT'S OK!?
            dtp.on("dp.show", function (e) {
                ngModelCtrl.$setViewValue(moment().add(1, 'hour').startOf('hour').toISOString())            
                scope.$apply();                
            });

            dtp.on("dp.change", function (e) {
                if (e.date) {
                    ngModelCtrl.$setViewValue(e.date.toISOString()); // instantiating Moment object with non-ISO string deprecated and soon to be removed, so converting from Moment => ISO String
                } else {
                    ngModelCtrl.$setViewValue(null);   
                }                
                scope.$apply();
            });

            // Use formatter to update date display (without changing ngModel) - https://medium.com/made-by-munsters/build-a-text-date-input-with-ngmodel-parsers-and-formatters-5b1732e0ced4
            let formatter = function formatter(value) {                
                return value ? moment(value).format(attrs.dateTimePicker) : value;
            }
            ngModelCtrl.$formatters.push(formatter);
        }
    };
};

export default dateTimePicker;