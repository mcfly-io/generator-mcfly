'use strict';

class BaseView {
    constructor() {
        this.url = '/';
    }

    getCurrentPageTitle() {
        return browser.getTitle();
    }

    get() {
        return browser.getCurrentUrl().then(currentUrl => {
            //console.log('browse.get ' + 'from ' + currentUrl + ' to ' + this.url);
            //if (!_.endsWith(currentUrl, this.url)) {
            return browser.get(this.url).then(() => {
                return browser.waitForUrlToChangeTo(new RegExp(this.url + '$'));
            });
            //}
        });
    }
}

module.exports = BaseView;