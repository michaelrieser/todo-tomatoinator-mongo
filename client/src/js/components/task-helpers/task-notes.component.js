class TaskNotesCtrl {
    constructor(AppConstants, Notes, Tasks, $http, $scope) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._Notes = Notes;
        this._Tasks = Tasks;
        this._$http = $http;

        this.notes = this.task.notes;
        // this.task.notes.forEach( (n) => console.log(n));
        this.showNoteForm = false;

        // this.items = [ {name: 1}, {name: 2}, {name: 3} ]; // ui-sortable TEST

        this.setHighestNoteOrderNumber();

        this.resetNoteForm();

        this.sortableTaskNoteHandlers = {
            start: (event, ui) => {
                this.startIdx = ui.item.index();
            },
            stop: (event, ui) => {
                this.stopIdx = ui.item.index();
                // this._Notes.updateTaskNotesOrderOnDrop(this.startIdx, this.stopIdx, this.task.id);
                this.updateTaskNotesOrderOnDrop(this.startIdx, this.stopIdx);
            }
        }

        $scope.$on('deleteNote', (evt, data) => this.deleteNote(data));
    }

    updateTaskNotesOrderOnDrop(startIdx, stopIdx) {
        if (startIdx === stopIdx) { return; }
        let tgtNote = this.task.notes[stopIdx];
        let initialTgtTaskOrder = tgtNote.order;

        // if set to firstnotetask in list, ex: 4 -> 1, set to lowest note order and increment other notes' order
        if (stopIdx === 0) {
            // let lowestTaskNoteOrder = this.task.notes.sort((a, b) => { return a.order - b.order })[0].order;
            let lowestTaskNoteOrder = Math.min.apply(Math, this.notes.map((n) => { return n.order }));
            tgtNote.order = lowestTaskNoteOrder;
            this._Notes.update(tgtNote).then(
                (success) => this.incrementOrderOfNonTgtTaskNotes(tgtNote, lowestTaskNoteOrder),
                (err) => console.log(err)
            )
        // else set to prior note's order +1
        } else {
            let priorTaskNoteOrderPlusOne = this.task.notes[stopIdx - 1].order + 1;
            let query = {
                filters: {
                    order: priorTaskNoteOrderPlusOne,
                    taskID: this.task.id
                }
            };
            this._Notes.query(query).then((res) => {
                let tgtOrderExists = res.notes.length === 1;
                // if order of note prior +1 exists
                if (tgtOrderExists) {
                    // add 1 to each object after (excluding newly updated note)
                    tgtNote.order = priorTaskNoteOrderPlusOne;
                    this._Notes.update(tgtNote).then(
                        (success) => this.incrementOrderOfNonTgtTaskNotes(tgtNote, priorTaskNoteOrderPlusOne),
                        (err) => console.log(err)
                    )
                // else order of note prior +1 does not exist - update note order
                } else { 
                    tgtNote.order = priorTaskNoteOrderPlusOne;
                    this._Notes.update(tgtNote);
                };
            })
        }
    }

    incrementOrderOfNonTgtTaskNotes(tgtNote, startOrder) {
        let request = {
            url: `${this._AppConstants.api}/notes/incrementorder`,
            method: 'PUT',
            data: { tgtNote: tgtNote, startOrder: startOrder }
        }
        return this._$http(request).then((res) => { return this.refreshNotesForTask() });
        // return this._$http(request).then((res) => this.updateFrontendOrderOfNonTgtTaskNotes(tgtNote, startOrder))
    }

    // @wip
    updateFrontendOrderOfNonTgtTaskNotes(tgtNote, startOrder) { 
        console.log(tgtNote);                
        let nonTgtNotes = this.task.notes.filter( (note) => note.order !== tgtNote.order);
        nonTgtNotes.forEach( (note) => note.order++ );
        // TODO: sort tasks and wire to incrementOrderOfNonTgtTaskNotes return method
    }

    refreshNotesForTask() {
        let queryConfig = { filters: { taskID: this.task.id }}
        this._Notes.query(queryConfig).then(
            (refreshedNotes) => this.task.notes = refreshedNotes.notes,
            (err) => console.log(err)
        )         
    }

    setHighestNoteOrderNumber() {
        // SEE: https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
        this.highestNoteOrderNumber = this.notes.length > 0
            ? Math.max.apply(Math, this.notes.map((n) => { return n.order }))
            : 0;
    }

    addTag() {
        // Make sure this tag isn't already in the array
        if (!this.newNoteForm.tagList.includes(this.tagField)) {
            this.newNoteForm.tagList.push(this.tagField);
            this.tagField = '';
        }
    }
    removeTag(tagName) {
        this.newNoteForm.tagList = this.newNoteForm.tagList.filter((slug) => slug != tagName);
    }

    toggleNoteForm() {
        this.showNoteForm = !this.showNoteForm;
    }

    resetNoteForm() {
        this.newNoteForm = {
            isSubmitting: false,
            order: null,
            title: '',
            isTodo: false,
            isChecklist: false,
            tagList: []
        }
    }

    // toggles between isTodo || isChecklist
    handleCbxChange(tgtVal) {
        let newNoteForm = this.newNoteForm;
        if (tgtVal === 'isTodo' && newNoteForm.isTodo && newNoteForm.isChecklist) { newNoteForm.isChecklist = false; }
        else if (tgtVal === 'isChecklist' && newNoteForm.isChecklist && newNoteForm.isTodo) { newNoteForm.isTodo = false; }
    }

    addNote() {
        this.newNoteForm.isSubmitting = true;
        this.newNoteForm.order = this.highestNoteOrderNumber + 1;
        this._Notes.add(this.task, this.newNoteForm).then(
            (newNote) => {
                this.notes.push(newNote);
                this.highestNoteOrderNumber = newNote.order;
                //   NOTE: below code would add todo note to end of todo notes list, but now just adding to end of combined list
                // if (note.isTodo) { // Add to end of TODO list
                //    var todoNotes = this.notes.filter((n) => n.isTodo);
                //    var lastTodoNote = todoNotes[todoNotes.length-1];
                //    var lastTodoIndex = this.notes.indexOf(lastTodoNote);
                //    this.notes.splice(lastTodoIndex + 1, 0, note); // Remove 0 elements from lastTodoIndex + 1 and insert new todo note                          
                // } else { // Add to end of notes list
                //     this.notes.push(note);
                // }
                this.resetNoteForm();
            },
            (err) => {
                this.newNoteForm.isSubmitting = false;
                this.newNoteForm.errors = err.data.errors;
            }
        )
    }
    deleteNote(data) {
        this._Notes.delete(data.noteID).then(
            (success) => {
                this.notes.splice(data.index, 1);
                this.setHighestNoteOrderNumber();
            },
            (err) => console.log(err)
        )
    }
}

let Task = {
    bindings: {
        task: '=',
        // deleteNote: '&'
    },
    controller: TaskNotesCtrl,
    templateUrl: 'components/task-helpers/task-notes.html'
};

export default Task;
