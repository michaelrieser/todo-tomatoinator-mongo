class TopTaskCtrl {
    constructor($scope) {
        'ngInject';
    }    
}

let TopTask =  {
    bindings: {
        task: '='       
    },
    controller: TopTaskCtrl,
    templateUrl: 'components/task-helpers/top-task.html'
};

export default TopTask;
