class AuthCtrl {
    constructor(User, TaskNotifications, Tasks, $state) {
        'ngInject';
        
        this._User = User;
        this._TaskNotifications = TaskNotifications;
        this._Tasks = Tasks;
        this._$state = $state;

        this.title = $state.current.title;
        this.authType = $state.current.name.replace('app.', '');
    }

    submitForm() {        
        this.isSubmitting = true;
        
        this._User.attemptAuth(this.authType, this.formData).then(
          (res) => {
            if (res.status && res.status === 200) {
              this._$state.go('app.home');
              // NOTE: query and set tasks here to populate tasks for resolving notifications
              this._Tasks.queryAndSet().then(
                  (tasksInfo) => this._TaskNotifications.initializeInterval(),
                  (err) => console.log(err)
              ); 
            } else if (res.status) {
              this.isSubmitting = false;            
              this.errors = res.data.errors;
            }
          }
        );
    }
}

export default AuthCtrl;
