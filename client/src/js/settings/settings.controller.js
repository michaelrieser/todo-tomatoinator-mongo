class SettingsCtrl {
    constructor(User, TaskNotifications, $state) {
        'ngInject';

        this._User = User;
        this._TaskNotifications = TaskNotifications;
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
        // this.logout = User.logout.bind(User); // NOTE: added method below to allow for TaskNotifications interval to be cleared as well
    }    

    logout() {
        this._User.logout();
        this._TaskNotifications.clearIntervalAndCloseToast();
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
