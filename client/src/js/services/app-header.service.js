export default class AppHeader {
    constructor() {
        'ngInject';

        this.collapsed = true;
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }

    collapseNavbar() {
        this.collapsed = true;
    }

}