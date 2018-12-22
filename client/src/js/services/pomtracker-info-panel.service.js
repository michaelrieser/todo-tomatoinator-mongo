export default class PomtrackerInfoPanel {
    constructor(PomTracker, $mdPanel) {
        'ngInject';

        this._PomTracker = PomTracker;
        this._$mdPanel = $mdPanel;
        this.pomreportTaskInfoPanelInstance = null;
    }

    // TODO: allow for task (ID || Object)? to be set as last param - for reuse on tasks page?
    queryAndDisplayPomtrackerInfoPanel(evt, targetTaskID, pomtracker) {        
        this._PomTracker.getPomtrackerTaskInfo(targetTaskID).then(
            (res) => this.handleQueryResponse(res, evt, pomtracker)
        )        
    }
    handleQueryResponse(res, evt, pomtracker) {
        if (res.status === 200) { this.openPomtrackerInfoPanel(res, evt, pomtracker); }
        else { alert('ERROR retrieving pomtracker Task data'); }
    }
    openPomtrackerInfoPanel(res, clickEv, pomtracker) {
        let positionElem = this.findAncestor(clickEv.target, 'pomreport-interval-wrapper') || clickEv.target;
        let pomtrackerInfo = res.data;
        
        let position = this._$mdPanel.newPanelPosition()
                                        .relativeTo(positionElem)
                                        .addPanelPosition(this._$mdPanel.xPosition.ALIGN_START, this._$mdPanel.yPosition.BELOW)
        let config = {
            attachTo: angular.element(document.body),
            controller: 'PomtrackerInfoPanelCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'pomreport/pomtracker-info-panel.html',
            // disableParentScroll: this.disableParentScroll,
            panelClass: 'pomtracker-info-panel',
            position: position,
            // propagateContainerEvents: true, // true => pointer events allowed to permeate panel wrapper
            // hasBackdrop: true,
            locals: {
                pomtrackerTaskInfo: pomtrackerInfo,
                pomtracker: pomtracker
            },
            openFrom: clickEv,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false,
            onDomRemoved: () => {
                this.pomreportTaskInfoPanelInstance = null;
                // TODO: referenced from ProjectPanel, see if we need to implement for PomtrackerInfoPanel
                    // need to explicitly set when user clicks outside of projectPanel or hits ESC 
                    // this.projectPanelCollapsed = true;
                    // this.projectPanelInstance = null;
            },
            zIndex: 2        
        }

        this._$mdPanel.open(config).then( (taskInfoPanel) => {
            // $mdPanel.open() creates an instance that must be referenced to call close(). It's also passed to project-panel.controller ctor        
            this.pomreportTaskInfoPanelInstance = taskInfoPanel;
        })        
    } 

    findAncestor(el, cls) {
        // SEE: https://stackoverflow.com/questions/22119673/find-the-closest-ancestor-element-that-has-a-specific-class
        // loop through, setting el to it's parent element and checking if that freshly set parent contains the target class
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el; // NOTE: returns null if parent element containing class passed as as 'el'
    }   
}
