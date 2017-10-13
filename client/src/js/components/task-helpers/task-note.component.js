class TaskNoteCtrl {
    constructor(Notes, $scope) {
        'ngInject';
        this._Notes = Notes;
        this._$scope = $scope;
        // this.notetodoComplete = this.note.todoComplete;
    }

    deleteNote(noteID, index) {
        this._$scope.$emit('deleteNote', {noteID: noteID, index: index});
            // this.isDeleting = true; // TODO: send this to parent ctrl as component will be deleted? -see article-actions.component
        }

    toggleTodo(note) {
        console.log(`component: ${note.todoComplete}`);
        this._Notes.toggleTodo(note).then(
            (success) => { 
                this.note.todoComplete = success 
            }, 
            (err) => console.log(err)
        )        
    }    
}

let Task =  {
    bindings: {
        task: '=',
        note: '=',
        index: '=',
        // deleteNote: '&' // Note: just emitting deleteNote up to task-notes.component.js       
    },
    controller: TaskNoteCtrl,
    templateUrl: 'components/task-helpers/task-note.html'
};

export default Task;
