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
        this.appname = this.config.get('appname');
        this.targetname = this._.camelize(this._.slugify(this._.humanize(this.targetname)));
        this.clientFolder = this.getClientFolder();
        this.ionic = this.config.get('ionic');
        this.famous = this.config.get('famous');
        this.fontawesome = this.config.get('fontawesome');
        this.bootstrap = this.config.get('boostrap');
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
                if(_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                    return 'Please enter a non empty name';
                }
                if(_.contains(that.clientTargets, value)) {
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
        this.mobile = this.options.mobile;
        if(_.contains(this.clientTargets, this.targetname)) {
            var msg = 'The target application name ' + this.targetname + ' already exists';
            this.log(this.utils.chalk.red.bold('(ERROR) ') + msg);
            var error = new Error(msg);
            this.emit('error', error);
        }
        // special case of target app that should not make a suffix
        this.suffix = this.targetnameToSuffix(this.targetname);
    },

    writing: {

        getComponents: function() {

            var done = this.async();
            this.sourceDir = path.join(__dirname, '../templates/target');
            this.sourceRoot(this.sourceDir);
            this.targetDir = path.join(process.cwd(), this.clientFolder);
            this.mkdir(this.targetDir);
            this.template('index.html', path.join(this.targetDir, 'index' + this.suffix + '.html'));
            if(this.mobile) {
                this.template('config.xml', path.join(this.targetDir, 'config' + this.suffix + '.xml'));
                this.directory('hooks', path.join(this.targetDir, 'cordova', this.targetname, 'hooks'));
            }
            this.template('scripts/main.js', path.join(this.targetDir, 'scripts/main' + this.suffix + '.js'));
            this.template('scripts/main.test.js', path.join(this.targetDir, 'scripts/main' + this.suffix + '.test.js'));
            this.template('styles/main.scss', path.join(this.targetDir, 'styles/main' + this.suffix + '.scss'));

            this.template('../app/client/404.html', this.clientFolder + '/404' + this.suffix + '.html');
            this.template('../app/client/robots.txt', this.clientFolder + '/robots' + this.suffix + '.txt');
            this.template('../app/client/favicon.ico', this.clientFolder + '/favicon' + this.suffix + '.ico');

            done();
        }
    },

    end: function() {
        var done = this.async();
        return this.injectAllModules().
        finally(done);
    }
});

module.exports = TargetGenerator;
