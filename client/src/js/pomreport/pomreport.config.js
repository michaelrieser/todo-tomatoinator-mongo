function PomreportConfig($stateProvider) {
  'ngInject';

  $stateProvider
  .state('app.pomreport', {
    abstract: true,
    views: {
        '': {
            templateUrl: 'pomreport/pomreport.html',
            controller: 'PomreportCtrl',
            controllerAs: '$ctrl',
            // resolve: {

            // }
        }        
    }
  })
  .state('app.pomreport.view', { 
    url: '/pomreport/:type',
    views: {
        'pomreport': {
            // TODO: dynamically generate templateUrl String from $stateParams
            templateUrl: 'pomreport/pomreport-daily.html', 
            controller: 'PomreportDisplayCtrl',
            controllerAs: '$ctrl',
            resolve: {
                pomtrackerInfo: function (PomTracker, $stateParams) {
                    return PomTracker.query($stateParams).then(
                        (pomtrackerInfo) => pomtrackerInfo,
                        (err) => console.log(err)
                    )
                }
            }
        }
    }
  })
  /* TODO: potentially try to merge into a single route, and dynamically set template(daily/weekly/etc..) from $stateParam(s) */
  /*    -DYNAMICALLY set template String: https://github.com/angular-ui/ui-router/issues/163 */
  /*    -DYNAMICALLY set controller => NOT POSSIBLE */
//   .state('app.pomreport.view', {
//       url: '/pomreport/:type', // TODO/QUESTION: set param ':type' to ':duration' || other?
//       params: {
//           // TODO: not sure if this is necessary, but see tasks.config.js => app.tasks.view if issues
//       },
//       views: {
//           'pomreport': {

//           }
//       }

//   })
 /* /TODO */

};

export default PomreportConfig;
