class TaskNotesCtrl {
    constructor(Notes, Tasks, $scope) {
        'ngInject';

        this.notes = this.task.notes;
        // this.task.notes.forEach( (n) => console.log(n));
        this.showNoteForm = false;
        this._Notes = Notes;
        
        this.resetNoteForm();        
        // this._Tasks = Tasks; 
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
            title: '',
            isTodo: false,
            tagList: []
        }
    }

    addNote() {
        this.newNoteForm.isSubmitting = true;
        this._Notes.add(this.task, this.newNoteForm).then(
            (note) => {
                console.log('success');
                console.log(`note: ${note}`);
                this.notes.unshift(note);
                this.resetNoteForm();
            },
            (err) => {
                console.log('failure');
                console.log(err);
                this.newNoteForm.isSubmitting = false;
                this.newNoteForm.errors = err.data.errors;
            }
        )
    }

    deleteNote(noteId, index) {
        // TODO: see article.controller.js in Conduit
    }
}

let Task =  {
    bindings: {
        task: '=',
    },
    controller: TaskNotesCtrl,
    templateUrl: 'components/task-helpers/task-notes.html'
};

export default Task;
