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
    // NOTE: optional param NOT specified in URL with a default value of null SEE: http://benfoster.io/blog/ui-router-optional-parameters 
    //	** LEFT FOR ILLUSTRATIVE PURPOSES **
    // url: '/tasks/:project/:status/?fromTasksView',
    // fromTasksView: null       
    url: '/pomreport/:type?offset',
    views: {
        'pomreport': {            
            templateUrl: function ($stateParams) {
                let reportType = $stateParams.type;
                return `pomreport/pomreport-${reportType}.html`
            },
            controller: 'PomreportDisplayCtrl',
            controllerAs: '$ctrl',
            resolve: {
                pomtrackerInfo: function (PomTracker, $stateParams) {
                    return PomTracker.queryAndSet($stateParams).then(
                        (pomtrackerInfo) => pomtrackerInfo,
                        (err) => console.log(err)
                    )
                }
            }
        }
    }
  })
};

export default PomreportConfig;
