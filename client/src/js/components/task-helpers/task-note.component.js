class TaskNoteCtrl {
    constructor(Notes, $scope) {
        'ngInject';
        this._Notes = Notes;
        this._$scope = $scope;
    }
    
    deleteNote(noteID, index) {
        this._$scope.$emit('deleteNote', {noteID: noteID, index: index});
            // this.isDeleting = true; // TODO: send this to parent ctrl as component will be deleted? -see article-actions.component
        }

    toggleTodo(note) {
        this._Notes.update(note).then(
            (updatedNote) => {},  
            (err) => console.log(err)
        )        
    }    
}

let TaskNote =  {
    bindings: {
        task: '=',
        note: '=',
        index: '=',
    },
    controller: TaskNoteCtrl,
    templateUrl: 'components/task-helpers/task-note.html'
};

export default TaskNote;
