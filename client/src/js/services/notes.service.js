export default class Notes {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;

  }

  add(task, note) {
    let request = {
      url: `${this._AppConstants.api}/tasks/notes`,
      method: 'POST',
      data: { task: task, note: note }
    };
    return this._$http(request).then((res) => res.data.note);
  }    

  delete(noteID) {
    let request = {
      url: `${this._AppConstants.api}/tasks/notes/${noteID}`,
      method: 'DELETE'
    };
    return this._$http(request).then((res) => res.data);
  }

  toggleTodo(note) {
    let request = { 
      url: `${this._AppConstants.api}/tasks/notes/${note.id}`,
      method: 'PUT',
      data: { setNoteTodoTo: note.todoComplete }
    };
    return this._$http(request).then((res) => res.data.todoComplete);
  }
}
