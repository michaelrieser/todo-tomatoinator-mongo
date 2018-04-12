export default class Projects {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;

    this.displayProject = 'all'; // TODO: allow user to save and set this dynamically with service on load
    
    this.projectsInfo = {};
    this.projects = [];
  }

  getDefaultProject() {
      var tgtProjectTitle = this.displayProject === 'all' ? 'miscellaneous' : this.displayProject;
      // find project in projects array and return - must set selected option to Object in ng-repeat list
      return this.projects.find( (p) => { return p.title === tgtProjectTitle }); 
  }

  save(project) {
    let request = {
      url: `${this._AppConstants.api}/projects`,
      method: 'POST',
      data: { project: project }
    };
    return this._$http(request).then((res) => res.data.project);
  }

  query(config) {
    // Create the $http object for this request
    let request = {
      url: `${this._AppConstants.api}/projects`,
      method: 'GET'
      // params: config.filters ? config.filters : null // TODO uncomment this for other concrete tasks routes (EX: InProgress/Completed/etc..)
    };
    return this._$http(request).then((res) =>  { return this.handleQueryResponse(res.data) });
  }    

  handleQueryResponse(projectsInfo) {
    angular.copy(projectsInfo, this.projectsInfo);
    angular.copy(projectsInfo.projects, this.projects)
    return projectsInfo;
  }

  refreshProjects() {
    this.query().then(
      (projectsInfo) => projectsInfo,
      (err) => console.log('ERROR refreshing projects')
    )
  }

  delete(project) {
    let request = {
      url: `${this._AppConstants.api}/projects/${project.id}`,
      method: 'DELETE'
    }
    return this._$http(request).then((res) => res.data);
  }
}
