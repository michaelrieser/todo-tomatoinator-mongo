class ChecklistStepTitleCtrl {
    constructor(Steps, $scope) {
        'ngInject';

        this._Steps = Steps;
        this._$scope = $scope;

        this.editingTitle = false;
    }
    
    handleEditTitleToggle() {
        this.editingTitle = !this.editingTitle;
        if (!this.editingTitle) { // Done making edits
            this.updateStep();
        }
    }
    
    updateStep() {
        this._Steps.update(this.step).then(
            (updatedStep) => {return updatedStep},
            (err) => console.log(err)
        )
    }     
}

let ChecklistStepTitle =  {
    bindings: {
        step: '='
    },
    controller: ChecklistStepTitleCtrl,
    templateUrl: 'components/checklist-helpers/checklist-step-title.html'
};

export default ChecklistStepTitle;
