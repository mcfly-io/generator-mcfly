'use strict';

class BaseView {
    constructor() {
        this.url = '/';
    }

    getCurrentPageTitle() {
        return browser.getTitle();
    }

    get() {
        return browser.get(this.url);
    }
}

module.exports = BaseView;
