function AppRun(AppConstants, AppHeader, $rootScope) {
  'ngInject';

  // collapse (mobile) navbar at start of state change (i.e., when ui-sref clicked)
  $rootScope.$on('$stateChangeStart', (e, toState, toParams, fromState, fromParams) => {
    $rootScope.collapseNavbar();
  })

  // change page title based on state
  $rootScope.$on('$stateChangeSuccess', (event, toState) => {
    $rootScope.setPageTitle(toState.title);
  });

  // Helper method for setting the page's title
  $rootScope.setPageTitle = (title) => {
    $rootScope.pageTitle = '';
    if (title) {
      $rootScope.pageTitle += title;
      $rootScope.pageTitle += ' \u2014 ';
    }
    $rootScope.pageTitle += AppConstants.appName;
  };

  $rootScope.collapseNavbar = () => {
    AppHeader.collapseNavbar();
  }

}

export default AppRun;
