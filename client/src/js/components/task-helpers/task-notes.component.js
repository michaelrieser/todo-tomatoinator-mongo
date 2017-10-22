class TaskNotesCtrl {
    constructor(Notes, Tasks, $scope) {
        'ngInject';

        this.notes = this.task.notes;
        // this.task.notes.forEach( (n) => console.log(n));
        this.showNoteForm = false;
        this._Notes = Notes;
        
        this.resetNoteForm();        
        // this._Tasks = Tasks; 

        $scope.$on('deleteNote', (evt, data) => this.deleteNote(data));
    }
    
    addTag() {
        // Make sure this tag isn't already in the array
        if (!this.newNoteForm.tagList.includes(this.tagField)) {
            this.newNoteForm.tagList.push(this.tagField);
            console.log(this.newNoteForm.tagList);
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
            title: '',
            isTodo: false,
            tagList: []
        }
    }

    addNote() {
        this.newNoteForm.isSubmitting = true;
        this._Notes.add(this.task, this.newNoteForm).then(
            (note) => {
                if (note.isTodo) { // Add to end of TODO list
                   var todoNotes = this.notes.filter((n) => n.isTodo);
                   var lastTodoNote = todoNotes[todoNotes.length-1];
                   var lastTodoIndex = this.notes.indexOf(lastTodoNote);
                   this.notes.splice(lastTodoIndex + 1, 0, note); // Remove 0 elements from lastTodoIndex + 1 and insert new todo note                          
                } else { // Add to end of notes list
                    this.notes.push(note);
                }
                this.resetNoteForm();
            },
            (err) => {
                console.log(err);
                this.newNoteForm.isSubmitting = false;
                this.newNoteForm.errors = err.data.errors;
            }
        )
    }
    deleteNote(data) {
        this._Notes.delete(data.noteID).then(
            (success) => { 
                this.notes.splice(data.index, 1)},
            (err) => console.log(err)
        )
    }
}

let Task =  {
    bindings: {
        task: '=',
        // deleteNote: '&'
    },
    controller: TaskNotesCtrl,
    templateUrl: 'components/task-helpers/task-notes.html'
};

export default Task;
