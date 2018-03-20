class ChecklistStepCtrl {
    constructor(Notes, Steps, $scope) {
        'ngInject';
        
        this._Notes = Notes;
        this._Steps = Steps;
        this._$scope = $scope;
    }
    
    deleteStep(stepID, index) {
        this._$scope.$emit('deleteStep', {stepID: stepID, index: index});
    }

    toggleStepComplete() {
        this._$scope.$emit('emitToggleStepComplete', {step: this.step});
    }
}

let ChecklistStep =  {
    bindings: {
        step: '=',
        index: '='
    },
    controller: ChecklistStepCtrl,
    templateUrl: 'components/checklist-helpers/checklist-step.html'
};

export default ChecklistStep;
