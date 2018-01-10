class TaskChecklistCtrl {
    constructor(Notes, Steps, $scope) {
        'ngInject';
        
        this._Notes = Notes;
        this._Steps = Steps;
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
                // TODO: perform action to update steps
                    // -EX: this.updateTaskNotesOrderOnDrop(this.startIdx, this.stopIdx);
            }
        }

        $scope.$on('deleteStep', (evt, data) => this.deleteStep(data));
    }
    
    setHighestStepOrderNumber() {        
        this.highestStepOrderNumber = this.note.steps.length > 0
            ? Math.max.apply(Math, this.note.steps.map((s) => { return s.order }))
            : 0;
        console.log(this.highestStepOrderNumber);
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
