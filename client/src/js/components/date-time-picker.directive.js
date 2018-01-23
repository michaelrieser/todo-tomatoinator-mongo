function dateTimePicker() {
    'ngInject';
    
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            var parent = $(element).parent();            
            var dtp = parent.datetimepicker({
                format: 'MMMM Do YYYY, h:mm a',
                useCurrent: false // sets date to null when datetimepicker loaded, fixes datetimepicker vanishing when calendar clicked on task    
            });
            dtp.on("dp.change", function (e) {
                // ngModelCtrl.$setViewValue(moment(e.date).format("LL"));
                ngModelCtrl.$setViewValue(moment(e.date));                
                scope.$apply();
            });
        }
    };
};

export default dateTimePicker;