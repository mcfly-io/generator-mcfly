'use strict';

var testHelper = require('./testHelper');
var chalk = require('chalk');
var Class = require('../class');

describe('generator:class', function() {
    var generator;

    beforeEach(function() {
        // create an instance of the generator
        generator = testHelper.createGenerator(Class);
        // mock log as we don't want to polute output
        generator.log = sinon.spy();
        // create the options
        generator.createOptions();
    });

    it('#ctor() should set version for travis', function() {
        expect(generator).to.have.property('travisOptions');
        expect(generator.travisOptions.version).to.equal('1.7.2');
    });

    it('#createOptions() should create expected options', function() {
        generator.createOptions();
        expect(generator.options).to.have.property('check-travis');
        expect(generator.options).to.have.property('check-git');
        expect(generator.options).to.have.property('skip-welcome-message');
    });

    it('#checkTravis() should log when travis is installed', function() {
        generator.options['check-travis'] = true;
        generator.log = sinon.spy();
        generator.utils.shell = {
            which: sinon.stub().returns(true),
            exec: sinon.stub(),
            exit: sinon.stub()
        };
        return generator
            .checkTravis()
            .then(function() {
                assert(generator.log.calledWith(chalk.gray('travis is installed, continuing...\n')));
            });

    });

    it('#checkTravis() when check-travis is false should do nothing', function() {
        generator.options['check-travis'] = false;
        return generator
            .checkTravis()
            .then(function(value) {
                assert.equal(value, undefined);
            });
    });

    it('#checkTravis() when check-travis is true and travis is installed should do nothing', function() {
        generator.options['check-travis'] = true;
        generator.utils.shell = {
            which: sinon.stub().returns(true)
        };
        return generator
            .checkTravis()
            .then(function(value) {
                assert.equal(value, true);
            });
    });

    it('#checkTravis() when check-travis is true and travis is not installed should install travis', function() {
        generator.options['check-travis'] = true;
        generator.utils.shell = {
            which: sinon.stub().returns(false),
            exec: sinon.stub()
        };
        return generator
            .checkTravis()
            .then(function(value) {
                assert(generator.utils.shell.which.calledWith('travis'));
                assert.equal(value, true);
                assert(generator.utils.shell.exec.calledOnce);
            });
    });

    it('#checkGit() should log when git is installed', function() {
        generator.options['check-git'] = true;
        generator.log = sinon.spy();
        generator.shell2 = {
            which: sinon.stub().returns(true),
            exec: sinon.stub(),
            exit: sinon.stub()
        };
        return generator
            .checkGit()
            .then(function() {
                assert(generator.log.calledWith(chalk.gray('git is installed, continuing...\n')));
            });

    });

    it('#checkGit() when check-git is false should do nothing', function() {
        generator.options['check-git'] = false;
        return generator
            .checkGit()
            .then(function(value) {
                assert.equal(value, undefined);
            });
    });

    it('#checkGit() when check-git is true and git is installed should do nothing', function() {
        generator.options['check-git'] = true;
        generator.utils.shell = {
            which: sinon.stub().returns(true)
        };
        return generator
            .checkGit()
            .then(function(value) {
                assert.equal(value, true);
            });
    });

    it('#checkGit() when check-git is true and git is not installed should throw', function() {
        generator.options['check-git'] = true;
        generator.utils.shell = {
            which: sinon.stub().returns(false),
            exec: sinon.stub(),
            exit: sinon.stub()
        };
        return generator
            .checkGit()
            .then(undefined, function(err) {
                assert.equal(err.name, 'Error');
            }).then(function() {
                assert(generator.utils.shell.exit.calledWith(1));
            });
    });

    it('#notifyUpdate() should exit when there is a new version', function(done) {
        var notifierCallback = sinon.spy();
        generator.utils.shell = {
            exit: sinon.stub()
        };
        generator.utils.updateNotifier = testHelper.updateNotifierMock.bind(this, {
            latest: '100.0.0'
        }, notifierCallback);
        generator.notifyUpdate({
            name: 'dummy',
            version: '1.0.0'
        });
        assert(notifierCallback.calledOnce);
        assert(generator.utils.shell.exit.calledWith(1));
        done();

    });

    it('#notifyUpdate() should not exit when version is up to date', function(done) {
        var notifierCallback = sinon.spy();
        generator.utils.shell = {
            exit: sinon.stub()
        };
        generator.utils.updateNotifier = testHelper.updateNotifierMock.bind(this, {
            latest: '1.0.0'
        }, notifierCallback);
        generator.notifyUpdate({
            name: 'dummy',
            version: '1.0.0'
        });
        assert(notifierCallback.notCalled);
        assert(generator.utils.shell.exit.notCalled);
        done();
    });

    it('#notifyUpdate() should not exit when notifier.update is undefined', function(done) {
        var notifierCallback = sinon.spy();
        generator.utils.shell = {
            exit: sinon.stub()
        };
        generator.utils.updateNotifier = testHelper.updateNotifierMock.bind(this, undefined, notifierCallback);
        generator.notifyUpdate({
            name: 'dummy',
            version: '1.0.0'
        });
        assert(notifierCallback.notCalled);
        assert(generator.utils.shell.exit.notCalled);
        done();
    });
    describe('#choicesToProperties()', function() {
        var choices = [{
            value: 'animateModule',
            name: 'angular-animate.js',
            checked: true
        }, {
            value: 'cookiesModule',
            name: 'angular-cookies.js',
            checked: false
        }, {
            value: 'resourceModule',
            name: 'angular-resource.js',
            checked: false
        }];

        it('should move answers to this', function() {
            var answers = {
                modules: ['animateModule', 'resourceModule']
            };
            generator.choicesToProperties(answers, choices, 'modules');
            assert(generator.animateModule === true);
            assert(generator.cookiesModule === false);
            assert(generator.resourceModule === true);
        });

        it('should accept answers undefined', function() {
            generator.choicesToProperties(undefined, choices, 'modules');

            assert(generator.animateModule === false);
            assert(generator.cookiesModule === false);
            assert(generator.resourceModule === false);
        });

        it('should accept answers.list undefined', function() {
            var answers = {
                modules: undefined
            };
            generator.choicesToProperties(answers, choices, 'modules');

            assert(generator.animateModule === false);
            assert(generator.cookiesModule === false);
            assert(generator.resourceModule === false);
        });
    });
});