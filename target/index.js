'use strict';

var path = require('path');
var _ = require('lodash');
var Class = require('../class');

var TargetGenerator = Class.extend({
    constructor: function() {
        Class.apply(this, arguments);
        this.createOptions();

        this.argument('targetname', {
            type: String,
            required: false
        });

        this.option('mobile', {
            desc: 'Indicates that the app is a mobile app',
            type: 'Boolean',
            defaults: false
        });

        this.option('skip-inject-modules', {
            desc: 'Indicates that the generator should not auto-inject all modules after scaffolding',
            type: 'Boolean',
            defaults: false
        });

        this.appname = this.config.get('appname');
        this.targetname = this.camelize(this.targetname);
        this.clientFolder = this.getClientFolder();
        this.ionic = this.config.get('ionic');
        this.famous = this.config.get('famous');
        this.fontawesome = this.config.get('fontawesome');
        this.bootstrap = this.config.get('bootstrap');
        this.material = this.config.get('material');
    },

    initializing: function() {
        var done = this.async();

        var that = this;
        this.clientModules = [];
        this.getClientTargets()
            .then(function(targets) {
                that.clientTargets = targets;
            }, function() {
                that.emit('error', 'No target found');
            }).
        finally(done);

    },

    prompting: function() {

        var done = this.async();
        var that = this;
        var prompts = [{
            name: 'targetname',
            when: function() {
                return !that.targetname || that.targetname.length <= 0;
            },
            message: 'What is the name of your target application?',
            default: this.targetname,
            validate: function(value) {
                value = _.str.trim(value);
                if (_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    return 'Please enter a non empty name';
                }
                if (_.contains(that.clientTargets, value)) {
                    return 'The target name ' + value + ' already exists';
                }
                return true;
            }
        }];

        this.prompt(prompts, function(answers) {
            this.targetname = this.targetname || answers.targetname;
            done();
        }.bind(this));

    },

    configuring: function() {
        this.mobile = this.options.mobile || this.config.get('mobile');
        this.ionic = this.options.ionic || this.config.get('ionic');
        this.famous = this.options.famous || this.config.get('famous');
        this.ngCordova = this.options.ngCordova || this.config.get('ngCordova');
        this.fontawesome = this.options.fontawesome || this.config.get('fontawesome');
        this.bootstrap = this.options.bootstrap || this.config.get('bootstrap');
        this.material = this.options.material || this.config.get('material');
        if (_.contains(this.clientTargets, this.targetname)) {
            var msg = 'The target application name ' + this.targetname + ' already exists';
            this.log(this.utils.chalk.red.bold('(ERROR) ') + msg);
            var error = new Error(msg);
            this.emit('error', error);
        }
        // special case of target app that should not make a suffix
        this.suffix = this.targetnameToSuffix(this.targetname);
        // build require for ionic bundle if target is mobile
        if (this.mobile) {
            this.ionicBundle = './ionic.io.bundle.min' + this.suffix;
        }

    },

    writing: {

        getComponents: function() {

            var done = this.async();
            this.sourceDir = path.join(__dirname, '../templates/target');
            this.sourceRoot(this.sourceDir);
            this.targetDir = path.join(process.cwd(), this.clientFolder);
            this.utils.mkdir(this.targetDir);
            this.template('index.html', path.join(this.targetDir, 'index' + this.suffix + '.html'));
            this.utils.mkdir(path.join(this.targetDir, 'images', this.targetname));
            this.utils.mkdir(path.join(this.targetDir, 'icons', this.targetname));
            this.utils.mkdir(path.join(this.targetDir, 'fonts', this.targetname));
            if (this.mobile) {
                this.template('config.xml', path.join(this.targetDir, 'config' + this.suffix + '.xml'));
                this.directory('hooks', path.join(this.targetDir, 'cordova', this.targetname, 'hooks'));
            }
            this.template('scripts/main.js', path.join(this.targetDir, 'scripts/main' + this.suffix + '.js'));
            this.template('scripts/main.test.js', path.join(this.targetDir, 'scripts/main' + this.suffix + '.test.js'));
            this.template('styles/main.scss', path.join(this.targetDir, 'styles/main' + this.suffix + '.scss'));
            this.template('styles/main.less', path.join(this.targetDir, 'styles/main' + this.suffix + '.less'));
            this.template('../app/client/404.html', this.clientFolder + '/404' + this.suffix + '.html');
            this.template('../app/client/robots.txt', this.clientFolder + '/robots' + this.suffix + '.txt');
            this.template('../app/client/favicon.ico', this.clientFolder + '/favicon' + this.suffix + '.ico');

            // add specific e2e test for the target
            this.template('../app/test/e2e/app/tests.protractor.js', path.join('test', 'e2e', this.targetname, 'tests.protractor.js'));
            this.template('../app/test/e2e/app/main.e2e.test.js', path.join('test', 'e2e', this.targetname, 'main.e2e.test.js'));

            done();
        }
    },

    end: function() {
        var chalk = this.utils.chalk;
        var that = this;
        var done = this.async();
        return this.injectAllModules()
            .then(function() {
                if (that.mobile) {
                    this.log('');
                    this.log('To use any of the ionic.io services (ionicPush, ionicDeploy, etc...)');
                    this.log('  1) Create your project on ' + chalk.cyan('https://apps.ionic.io'));
                    this.log('  2) ' + chalk.blue('gulp_tasks/common/constants.js') + ':');
                    this.log('     - fill in ' + chalk.yellow('constants.ionic' + that.targetname + '.app_id') + ' and ' + chalk.yellow('constants.ionic' + that.targetname + '.api_key'));
                    this.log('  3) Run ' + chalk.magenta('gulp ionic:platformcopy --target=' + that.targetname));
                    this.log('  4) ' + chalk.blue('client/index' + that.suffix + '.html') + ':');
                    this.log('     - comment out line ' + chalk.green('22') + ' to disable the default loading of ' + chalk.blue('cordova.js'));
                    this.log('  5) ' + chalk.blue('client/scripts/main' + that.suffix + '.js') + ':');
                    this.log('     - uncomment line ' + chalk.green('14') + ' to require ' + chalk.blue('client/scripts/ionic.io.bundle.min' + that.suffix + '.js'));
                    this.log('     - uncomment the module dependency for ' + chalk.blue('\'ionic.service.core\''));
                }
            })
            .finally(done);

    }
});

module.exports = TargetGenerator;
