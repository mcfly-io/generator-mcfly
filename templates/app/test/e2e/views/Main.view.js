'use strict';

var BaseView = require('./BaseView');

class MainView extends BaseView {
    constructor() {
        super();
        this.url = '/#/main';
    }
}

module.exports = MainView;
