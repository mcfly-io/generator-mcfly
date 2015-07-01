'use strict';
describe('e2e test', function() {
    
    beforeEach(function() {
        browser.get('http://localhost:5555');
    });

    afterEach(function() {
        browser.manage().logs().get('browser').then(function(browserlog) {
            //expect(browserlog.length).toEqual(0);
            if(browserlog.length) {
                console.error('Error log: ' + JSON.stringify(browserlog));
            }
        });
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Sample app');
    });

});
