class HomeCtrl {
  constructor(AppConstants, User) {
    'ngInject';

    this.appName = AppConstants.appName;
    console.log(User); // TODO => Have service that aggregates user stats (task #, completed, etc..) and display
  }


}

export default HomeCtrl;
