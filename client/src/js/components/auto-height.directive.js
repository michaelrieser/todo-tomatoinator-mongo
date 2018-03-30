function autoHeight() {
    'ngInject';

    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            console.log(element[0]);
            // console.log(element[0].scrollHeight);
            // element[0].style.height = element[0].value > 
            // element[0].style.height = (element[0].scrollHeight < 0) ? '30px' : `${element[0].scrollHeight}px`;
        }
    }
}

export default autoHeight;