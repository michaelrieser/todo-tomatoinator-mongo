export default class TaskNotifications {
  constructor(AppConstants, $http, $interval) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;
    this._$interval = $interval;        

  }



//   add(task, note) {
//     let request = {
//       url: `${this._AppConstants.api}/notes`,
//       method: 'POST',
//       data: { task: task, note: note }
//     };
//     return this._$http(request).then((res) => res.data.note);
//   }    

//   delete(noteID) {
//     let request = {
//       url: `${this._AppConstants.api}/notes/${noteID}`,
//       method: 'DELETE'
//     };  
//     return this._$http(request).then((res) => res.data);
//   }

  query(queryConfig = {}) {
    let request = {
      url: `${this._AppConstants.api}/tasks/notifications`,
      method: 'GET',
      // params: queryConfig.filters ? queryConfig.filters : null
      // TODO: eventually add functionality (here + update route) for user to specify date range
    }
    return this._$http(request).then((res) => this.handleQueryResponse(res.data) );
  }
  handleQueryResponse(res) {
    console.log(res);
    this.taskNotificationInfo = res.notifications;
    return this.taskNotificationInfo;
  }

//   update(note) {
//     let request = { 
//       url: `${this._AppConstants.api}/notes`,
//       method: 'PUT',
//       data: { note: note }
//     };
//     return this._$http(request).then((res) => res.data.todoComplete);
//   }
}
