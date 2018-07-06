class ListErrorsCtrl {
    constructor() {
        'ngInject';
        
        this.isArray = angular.isArray;
    }
}

let ListErrors = {
    bindings: {
        errors: '='    
    },
    controller: ListErrorsCtrl,
    templateUrl: 'components/list-errors.html'
};

export default ListErrors;
