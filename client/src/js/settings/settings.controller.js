class SettingsCtrl {
    constructor(User, $state) {
        'ngInject';

        this._User = User;
        this._$state = $state;

        this.formData = {
            // Note: these are set in User.verifyAuth() method which is resolved as part of base 'app' router
            email: User.current.email,
            bio: User.current.bio,
            image: User.current.image,
            username: User.current.username
        };

        // Bind is req'd because the logout method assumes
        //  the execution context is within the User object.
        this.logout = User.logout.bind(User);
    }    

    submitForm() {
        this.isSubmitting = true;
        this._User.update(this.formData).then(
            (user) => {
                this.isSubmitting = false;
            },
            (err) => {
                this.isSubmitting = false;
                this.errors = err.data.errors;
            }
        )
    }
}

export default SettingsCtrl;
