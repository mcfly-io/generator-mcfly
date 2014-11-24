'use strict';
describe('angularjs homepage', function() {
    var firstNumber = element(by.model('first'));
    var secondNumber = element(by.model('second'));
    var goButton = element(by.id('gobutton'));
    var latestResult = element(by.binding('latest'));

    beforeEach(function() {
        browser.get('http://juliemr.github.io/protractor-demo/');
    });

    afterEach(function() {
        browser.manage().logs().get('browser').then(function(browserlog) {
            expect(browserlog.length).toEqual(0);
            if(browserlog.length) {
                console.error('Error log: ' + JSON.stringify(browserlog));
            }
        });
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Super Calculator');
    });

    it('should add one and two', function() {
        firstNumber.sendKeys(1);
        secondNumber.sendKeys(2);

        goButton.click();

        expect(latestResult.getText()).toEqual('3');
    });

});