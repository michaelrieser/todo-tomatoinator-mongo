class TaskChecklistCtrl {
    constructor(AppConstants, Notes, Steps, $http, $scope, $q) {
        'ngInject';
        
        this._AppConstants = AppConstants;
        this._Notes = Notes;
        this._Steps = Steps;

        this._$http = $http;
        this._$scope = $scope;
        this._$q = $q;

        this.showStepForm = false;
        this.resetStepForm();

        this.steps = this.note.steps
        this.updateRawStepCompletionPercentage();

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
        // $scope.$on('emitUpdateTaskChecklistOnStepChange', (evt, data) => this.updateTaskChecklistOnStepChange());
        $scope.$on('emitToggleStepComplete', (evt, data) => this.toggleStepComplete(data.step))
    }

    setHighestStepOrderNumber() {        
        this.highestStepOrderNumber = this.note.steps.length > 0
            ? Math.max.apply(Math, this.note.steps.map((s) => { return s.order; }))
            : 0;
    }

    updateTaskChecklistOnStepChange() {
        this.updateRawStepCompletionPercentage();
        this.syncChecklistCompletionWithSteps();             
    }

    // Check and mark parent checklist as complete if all of its children are complete, otherwise set uncomplete
    syncChecklistCompletionWithSteps() {
        if (this.allStepsCompleted() && !this.note.isComplete) {
            this.note.isComplete = true;
            this._Notes.update(this.note).then(
                (updatedNote) => console.log('success'),
                (err) => console.log(err)
            )
        } else if (this.note.isComplete && !this.allStepsCompleted()) {
            this.note.isComplete = false;
            this._Notes.update(this.note).then(
                (updatedNote) => console.log('success'),
                (err) => console.log(err)
            )
        }   
    }


    allStepsCompleted() {
        return this.stepsCompleted === this.stepsTotal;
    }
    getStepsCompleted() {
        return this.steps.filter( (s) => { if (s.stepComplete) { return s} }).length; 
    }
    getStepsTotal() {
        return this.steps.length;
    }
    getRawStepCompletionPercentage() {
        return this.stepsCompleted === 0 ? 0 : (this.stepsCompleted / this.stepsTotal) * 100;
    }
    updateRawStepCompletionPercentage() {        
        this.stepsCompleted = this.getStepsCompleted();
        this.stepsTotal = this.getStepsTotal();
        this.rawCompletionPercentage = this.getRawStepCompletionPercentage();
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
                this.updateTaskChecklistOnStepChange();             
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

    toggleTodo(note) {
        this.note.steps.forEach( (step) => { step.stepComplete = note.isComplete; } );
        this.updateRawStepCompletionPercentage();
        this._$q.when(
            this._Notes.update(note),
            this._Notes.updateChecklistSteps(note)
        )       
    }    

    // emitted from step
    toggleStepComplete(step) {
        this.updateTaskChecklistOnStepChange();
        this._Steps.update(step).then(
            (updatedStep) => {
                console.log('step updated!')
            },
            (err) => console.log(err) // QUESTION/TODO: call this.updateTaskChecklistOnStepChange() again since step (probably) wasn't updated properly?
        )   
    }

    deleteStep(data) {
        this._Steps.delete(data.stepID).then(
            (success) => {
                this.steps.splice(data.index, 1);
                this.setHighestStepOrderNumber();
                this.updateTaskChecklistOnStepChange();
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
