class PomtrackerInfoPanel {
  // NOTE: mdPanelReference(resolved from $mdPanel.open()) may be passed to panel ctrl ctor
  constructor(mdPanelRef, TimeUtils, $scope) {
    'ngInject';

    this._mdPanelRef = mdPanelRef;
    this._TimeUtils  = TimeUtils;
    this._$scope     = $scope;

    this.minutesElapsed = this.pomtrackerTaskInfo.minutesElapsed;
    this.taskTitle = this.getTaskTitle();
    this.taskProjectTitle = this.getTaskProjectTitle();
  }

  getTaskTitle() {
    if (this.pomtracker.task) {
        return this.pomtracker.task.title;
    } else if (this.pomtracker.initialTaskTitle) {
        return this.pomtracker.initialTaskTitle;
    } else {
        this.taskMissingTitle = true;
        return '<task-not-found>';            
    }
  }
  getTaskProjectTitle() {
    if (this.pomtracker.task && this.pomtracker.task.project) {
      return this.pomtracker.task.project.title;
    } else {
      this.taskMissingProject = true;
      return '<project-not-found>';
    }
  }

  taskHasDueDateTime() {
    return this.pomtracker.task && this.pomtracker.task.dueDateTime;
  }

  colorBasedOnTimeRemaining() {
      return this._TimeUtils.colorBasedOnTimeRemaining(this.pomtracker.task.dueDateTime);
  }  
}

export default PomtrackerInfoPanel;
