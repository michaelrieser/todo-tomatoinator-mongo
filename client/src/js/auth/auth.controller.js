class AuthCtrl {
    constructor(User, TaskNotifications, $state) {
        'ngInject';
        
        this._User = User;
        this._TaskNotifications = TaskNotifications;
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
              this._TaskNotifications.initializeInterval(); // init interval to get notifications & trigger mdToast if notifications exist
            } else if (res.status) {
              this.isSubmitting = false;            
              this.errors = res.data.errors;
            }
          }
        );
    }
}

export default AuthCtrl;
