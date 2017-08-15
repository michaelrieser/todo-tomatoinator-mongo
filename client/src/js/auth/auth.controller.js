class AuthCtrl {
    constructor(User, $state) {
        'ngInject';
        
        this._User = User;
        this.title = $state.current.title;
        this.authType = $state.current.name.replace('app.', '');
    }
    
    submitForm() {
        console.log('submitForm()');
        
        this.isSubmitting = true;
        
        this._User.attemptAuth(this.authType, this.formData).then(
          // Callback for success
          (res) => {
            console.log('success');
            this.isSubmitting = false;
            console.log(res);
          },
          // Callback for failure
          (err) => {
            console.log('failure');
            this.isSubmitting = false;
            console.log(err);
            console.log(err.data.errors);
          }
        );
    }
}

export default AuthCtrl;
