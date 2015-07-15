'use strict';
describe('e2e test', function() {

    beforeEach(function() {
        //browser.ignoreSynchronization = true;
        browser.get('/');  // the base url is set in protractor.conf.js
    });

    afterEach(function() {
        browser.manage().logs().get('browser').then(function(browserlog) {
            //expect(browserlog.length).toEqual(0);
            if (browserlog.length) {
                //console.error('Error log: ' + JSON.stringify(browserlog));
            }
        });
    });

    afterAll(function(done) {
        // make sure you keep this otherwise screen shot reporter bypass the latest test
        process.nextTick(done);
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Sample app');
    });

});
