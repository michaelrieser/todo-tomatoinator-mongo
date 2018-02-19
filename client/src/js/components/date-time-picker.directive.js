function dateTimePicker() {
    'ngInject';
    
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            // NOTE: Valid Moment Date instantiation (with format): moment('2018-02-09T05:00:00.000Z', 'YYYY/MM/DD, h:mm a')
            //       Instantiating Moment Date with format 'MMMM Do YYYY, h:mm a' is not valid
            var parent = $(element).parent();            
            var dtp = parent.datetimepicker({
                keyBinds: {
                    enter: function() {
                        console.log(scope)
                        console.log(ngModelCtrl)
                        // TODO: allow user to submit date with Enter keypress - need to call parent
                        //  => could do something like scope.$ctrl.<method-to-blur-element/submit>, but NEED TO MAKE SURE METHOD SHARED B/TW TASK + NOTIFICATION DATE TIME PICKERS
                    }
                },
                useCurrent: false, // sets date to null || existing dueDateTime when datetimepicker loaded, fixes datetimepicker vanishing when calendar clicked on task   
                format: attrs.dateTimePicker,
                showClear: true
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