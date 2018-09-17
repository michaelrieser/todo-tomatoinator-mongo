export default class ProjectPanel {
    constructor($mdPanel) {
        'ngInject';

        this._$mdPanel = $mdPanel;

        this.projectPanelCollapsed = true;
    }

    toggleProjectPanel(evt) {
        this.projectPanelCollapsed = !this.projectPanelCollapsed;
        this.projectPanelCollapsed ? this.closeProjectPanel() : this.openProjectPanel(evt);
    }

    openProjectPanel(clickEv) {
        let position = this._$mdPanel.newPanelPosition().absolute().center()
                                        // .relativeTo('.project-panel-toggle')
                                        // .addPanelPosition(this._$mdPanel.xPosition.ALIGN_START, this._$mdPanel.yPosition.BELOW)
        let config = {
            attachTo: angular.element(document.body),
            controller: 'ProjectPanelCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'components/project-helpers/project-panel.html',
            // disableParentScroll: this.disableParentScroll,
            panelClass: 'project-panel',
            position: position,
            // propagateContainerEvents: true, // true => pointer events allowed to permeate panel wrapper
            hasBackdrop: true,
            locals: {},
            openFrom: clickEv,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false,
            onDomRemoved: () => {
                // need to explicitly set when user clicks outside of projectPanel or hits ESC 
                this.projectPanelCollapsed = true;
                this.projectPanelInstance = null;
            },
            zIndex: 2        
        }

        this._$mdPanel.open(config).then( (projectPanel) => {
            // $mdPanel.open() creates an instance that must be referenced to call close(). It's also passed to project-panel.controller ctor        
            this.projectPanelInstance = projectPanel;
        })
    }

    // TODO/REFACTOR?: move this to ProjectPanelCtrl => unsure how to add methods to instance/proto?
    //  ** SEE: project.component.js
    closeProjectPanel() {
        this.projectPanelInstance && this.projectPanelInstance.close().then( () => {
            this.projectPanelCollapsed = true;
            this.projectPanelInstance = null;
        });
    }    


}
