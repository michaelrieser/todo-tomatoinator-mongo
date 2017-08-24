// TODO: copied from 'Creating the article editor' - adjust to use for tasks!
export default class Tasks {
  constructor(AppConstants, $http) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;


  }

  // Creates an article
  save(article) {
    let request = {
      url: `${this._AppConstants.api}/articles`,
      method: 'POST',
      data: { article: article }
    };

    return this._$http(request).then((res) => res.data.article);
  }

  getAll() {
      console.log('TODO - create & wire up backend routes and return tasks (w/notes) for current user');
  };
}