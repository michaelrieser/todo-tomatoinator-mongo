class TaskChecklistCtrl {
    constructor(AppConstants, Notes, Steps, $http, $scope) {
        'ngInject';
        
        this._AppConstants = AppConstants;
        this._Notes = Notes;
        this._Steps = Steps;

        this._$http = $http;
        this._$scope = $scope;

        this.showStepForm = false;
        this.resetStepForm();

        this.steps = this.note.steps

        this.setHighestStepOrderNumber(); 

        this.sortableStepHandlers = {
            start: (event, ui) => {
                this.startIdx = ui.item.index();
            },
            stop: (event, ui) => {                
                this.stopIdx = ui.item.index();
                this.updateStepOrderOnDrop(this.startIdx, this.stopIdx);
            }
        }

        $scope.$on('deleteStep', (evt, data) => this.deleteStep(data));
    }
    
    setHighestStepOrderNumber() {        
        this.highestStepOrderNumber = this.note.steps.length > 0
            ? Math.max.apply(Math, this.note.steps.map((s) => { return s.order }))
            : 0;
    }

    toggleStepForm() {
        this.showStepForm = !this.showStepForm;
    }

    resetStepForm() {
        this.newStepForm = {
            isSubmitting: false,
            title: '',
            order: null,
            stepComplete: false,
            note: this.note.id
        }
    }

    addStep() {
        this.newStepForm.isSubmitting = true;
        this.newStepForm.order = this.highestStepOrderNumber + 1;
        this._Steps.add(this.newStepForm).then(
            (newStep) => {                
                this.highestStepOrderNumber = newStep.order;                
                this.steps.push(newStep); 
                this.resetStepForm();                
            },
            (err) => {
                this.newStepForm.isSubmitting = false;
                this.newStepForm.errors = err.data.errors;
            }
        )
    }

    deleteChecklist(noteID, index) {
        this._$scope.$emit('deleteNote', {noteID: noteID, index: index});
            // this.isDeleting = true; // TODO: send this to parent ctrl as component will be deleted? -see article-actions.component
    }

    // TODO: update this method to automatically check all nested checklist steps
    toggleTodo(note) {
        this._Notes.update(note).then(
            (updatedNote) => {},  
            (err) => console.log(err)
        )        
    }    

    deleteStep(data) {
        this._Steps.delete(data.stepID).then(
            (success) => {
                this.steps.splice(data.index, 1);
                this.setHighestStepOrderNumber();
            },
            (err) => console.log(err)
        )
    }

    updateStepOrderOnDrop(startIdx, stopIdx) {
        if (startIdx === stopIdx) { return; }
        let tgtStep = this.steps[stopIdx];
        let initialTgtStepOrder = tgtStep.order;

        // if set to first step in list, ex: 4 -> 1, set to lowest step order and increment other steps' order
        if (stopIdx === 0) {
            let lowestStepOrder = Math.min.apply(Math, this.steps.map((s) => { return s.order }));
            tgtStep.order = lowestStepOrder;
            this._Steps.update(tgtStep).then(
                (success) => this.incrementOrderOfNonTgtSteps(tgtStep, lowestStepOrder),
                (err) => console.log(err)
            )
        // else set to prior steps's order +1
        } else {
            let priorStepOrderPlusOne = this.steps[stopIdx - 1].order + 1;
            let query = {
                filters: {
                    order: priorStepOrderPlusOne,
                    noteID: this.note.id
                }
            };
            this._Steps.query(query).then((res) => {
                let tgtOrderExists = res.steps.length === 1;
                // if order of note prior +1 exists
                if (tgtOrderExists) {
                    // add 1 to each object after (excluding newly updated note)
                    tgtStep.order = priorStepOrderPlusOne;
                    this._Steps.update(tgtStep).then(
                        (success) => this.incrementOrderOfNonTgtSteps(tgtStep, priorStepOrderPlusOne),
                        (err) => console.log(err)
                    )
                // else order of note prior +1 does not exist - update note order
                } else { 
                    tgtStep.order = priorStepOrderPlusOne;
                    this._Steps.update(tgtStep);
                };
            })
        }        
    }

    incrementOrderOfNonTgtSteps(tgtStep, startOrder) {
        let request = {
            url: `${this._AppConstants.api}/steps/incrementorder`,
            method: 'PUT',
            data: { tgtStep: tgtStep, startOrder: startOrder }
        }
        return this._$http(request).then((res) => { return this.refreshStepsForChecklist() });
        // return this._$http(request).then((res) => this.updateFrontendOrderOfNonTgtTaskNotes(tgtNote, startOrder))
    }    

    refreshStepsForChecklist() {
        let queryConfig = { filters: { noteID: this.note.id }} // TODO test stepComplete & update route accordingly
        this._Steps.query(queryConfig).then(
            (refreshedSteps) => this.steps = refreshedSteps.steps,
            (err) => console.log(err)
        )    
    }
}

let TaskChecklist =  {
    bindings: {
        task: '=',
        note: '=',
        index: '=',
    },
    controller: TaskChecklistCtrl,
    templateUrl: 'components/checklist-helpers/task-checklist.html'
};

export default TaskChecklist;
