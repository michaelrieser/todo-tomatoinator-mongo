class TestComponentCtrl {
    constructor($scope) {
        'ngInject';

        this.list2 = ['A', 'B', 'C'];
    }    


}

let TestComponent =  {
    bindings: {
        sortableoptions: '='
    },
    controller: TestComponentCtrl,
    templateUrl: 'components/task-helpers/test-component.html'
};

export default TestComponent;
