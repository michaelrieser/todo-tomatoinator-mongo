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
    return this._$http(request).then((res) => this.addNewProjectToList(res.data.project) );
  }

  addNewProjectToList(project) {
    this.highestOrderNumber = project.order;
    this.projects.push(project);
    return project;
  }

  query(queryConfig = {}) {
    // Create the $http object for this request
    let request = {
      url: `${this._AppConstants.api}/projects`,
      method: 'GET',
      params: queryConfig.filters ? queryConfig.filters : null 
    };
    return this._$http(request).then((res) =>  { return res.data });    
  }

  queryAndSet(queryConfig = {}) {
    // Create the $http object for this request
    let request = {
      url: `${this._AppConstants.api}/projects`,
      method: 'GET',
      params: queryConfig.filters ? queryConfig.filters : null 
    };
    return this._$http(request).then((res) =>  { return this.handleQueryResponse(res.data) });
  }    

  handleQueryResponse(projectsInfo) {
    angular.copy(projectsInfo, this.projectsInfo);
    angular.copy(projectsInfo.projects, this.projects);
    this.lowestOrderNumber = projectsInfo.lowestOrderNumber;
    this.highestOrderNumber = projectsInfo.highestOrderNumber;
    return projectsInfo;
  }

  refreshProjects() {
    this.queryAndSet().then(
      (projectsInfo) => projectsInfo,
      (err) => console.log(err)
    )
  }

  update(project) {
    let request = {
      url: `${this._AppConstants.api}/projects/update`,
      method: 'PUT',
      data: { project: project } // => becomes req.body.project in projects.js route
    }
    return this._$http(request).then((res) => res.data.project);    
  }

  delete(project) {
    let request = {
      url: `${this._AppConstants.api}/projects/${project.id}`,
      method: 'DELETE'
    }
    return this._$http(request).then((res) => res.data);
  }

  updateProjectsOrderOnDrop(startIdx, stopIdx) {
    if (startIdx === stopIdx) { return; }
    let tgtProject = this.projects[stopIdx];
    let initialTgtTaskOrder = tgtProject.order;

    // if set to first project in list, ex: 4 -> 1, set to lowest order of currently displayed projects and increment order of other projects
    if (stopIdx === 0) {
      tgtProject.order = this.lowestOrderNumber;
      this.update(tgtProject).then(
        (success) => this.incrementOrderOfNonTgtProjects(tgtProject, this.lowestOrderNumber),
        (err) => console.log(err)
      )
    // else set to prior project's order + 1  
    } else {
      let priorProjectOrderPlusOne = this.projects[stopIdx - 1].order + 1;
      let query = { filters: { order: priorProjectOrderPlusOne } };
      this.query(query).then((res) => {
        let tgtOrderExists = res.projects.length === 1;
        // if order of project prior +1 exists
        if (tgtOrderExists) {
          // add 1 to each object after (excluding newly updated task)
          tgtProject.order = priorProjectOrderPlusOne;
          this.update(tgtProject).then(
            (success) => this.incrementOrderOfNonTgtProjects(tgtProject, priorProjectOrderPlusOne),
            (err) => console.log(err)
          )
        // else order of task prior +1 does not exist - update task order
        } else {
          tgtProject.order = priorProjectOrderPlusOne;
          this.update(tgtProject);
        };        
      });
    }

  }

  incrementOrderOfNonTgtProjects(tgtProject, startOrder) {
    let request = {
      url: `${this._AppConstants.api}/projects/incrementorder`,
      method: 'PUT',
      data: { tgtProject: tgtProject, startOrder: startOrder }
    }
    return this._$http(request).then((res) => { return this.refreshProjects() });
  }
}
