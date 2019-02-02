class AuthCtrl {
    constructor(authTypeOverride, User, TaskNotifications, Tasks, $state) {
        'ngInject';

        this._User = User;
        this._TaskNotifications = TaskNotifications;
        this._Tasks = Tasks;
        this._$state = $state;

        // Modified to allow other routes to pass 'authTypeOverride' from resolve binding - ex: app.home for nested multiple named view
        let authTitleOverride = this.getAuthTitleOverride(authTypeOverride);
        this.title = authTitleOverride || $state.current.title;
        this.authType = authTypeOverride || $state.current.name.replace('app.', '');
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

    getAuthTitleOverride(authTypeOverride) {
      if (!authTypeOverride) { return null; }
      return authTypeOverride === 'register' ? 'Sign Up' : 'Sign In';
    }
}

export default AuthCtrl;
