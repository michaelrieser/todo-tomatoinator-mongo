class NoteTitleCtrl {
    constructor(Notes, $scope) {
        'ngInject';

        this._Notes = Notes;
        this._$scope = $scope;

        this.editingTitle = false;
    }
    
    handleEditTitleToggle() {
        this.editingTitle = !this.editingTitle;
        if (!this.editingTitle) { // Done making edits
            this.updateNote();
        }
    }
    
    updateNote() {
        this._Notes.update(this.note).then(
            (updatedNote) => {return updatedNote},
            (err) => console.log(err)
        )
    }     
}

let NoteTitle =  {
    bindings: {
        note: '='
    },
    controller: NoteTitleCtrl,
    templateUrl: 'components/note-helpers/note-title.html'
};

export default NoteTitle;
