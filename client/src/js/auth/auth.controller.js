class AuthCtrl {
    constructor(User, $state) {
        'ngInject';
        
        this._User = User;
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
            } else if (res.status) {
              this.isSubmitting = false;            
              this.errors = res.data.errors;
            }
          }
        );
    }
}

export default AuthCtrl;
