class ChecklistStepCtrl {
    constructor(Notes, Steps, $scope) {
        'ngInject';
        
        this._Notes = Notes;
        this._Steps = Steps;
        this._$scope = $scope;
    }
    
    deleteStep(noteID, index) {
        this._$scope.$emit('deleteStep', {stepID: noteID, index: index});
            // this.isDeleting = true; // TODO: send this to parent ctrl as component will be deleted? -see article-actions.component
        }

    toggleStepComplete() {
        this._Steps.update(this.step).then(
            (updatedStep) => { console.log('success!') },
            (err) => console.log(err)
        )   
    }    
}

let ChecklistStep =  {
    bindings: {
        step: '=',
    },
    controller: ChecklistStepCtrl,
    templateUrl: 'components/checklist-helpers/checklist-step.html'
};

export default ChecklistStep;
