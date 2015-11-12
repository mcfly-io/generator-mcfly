'use strict';
var path = require('path');
var utils = require('../utils');
var Class = require('../class/component.js')('directives', 'directive');
var _ = require('lodash');

var DirectiveGenerator = Class.extend({
    constructor: function() {

        Class.apply(this, arguments);
        //this.createOptions();
        this.argument('directivename', {
            type: String,
            required: false
        });

        this.option('compile', {
            desc: 'Scaffold a directive with compile, pre and post link functions',
            type: 'Boolean',
            defaults: true
        });

        this.directivename = this.camelize(this.directivename);

    },

    initializing: function() {
        DirectiveGenerator.__super__.initializing.apply(this, arguments);
    },

    prompting: function() {

        var done = this.async();
        DirectiveGenerator.__super__.prompting.call(this, done);
    },

    configuring: function() {
        this.htmlname = _.snakeCase(this.directivename);
        this.compile = this.options.compile;
    },

    writing: function() {
        if (!_.contains(this.clientModules, this.moduleFolder)) {
            this.log(this.utils.chalk.red('Error: ') + 'The module name ' + this.utils.chalk.yellow(this.modulename) + ' does not exist');
            return;
        }
        var done = this.async();
        this.sourceRoot(path.join(__dirname, '../templates/' + 'directive'));
        var targetDir = path.join(this.clientFolder, 'scripts', this.moduleFolder, 'directives');
        this.utils.mkdir(targetDir);

        // make sure the fitlers/index.js exist
        utils.createIndexFile(this, '../component', targetDir);
        var filename = this.casify(this.directivename);
        filename = this.suffixify(filename, 'directive');
        this.filename = filename; // passing the value to the template
        if (this.compile === true || this.compile === 'true') {
            this.template('index-compile.js', path.join(targetDir, filename + '.js'));
        } else {
            this.template('index.js', path.join(targetDir, filename + '.js'));
        }
        this.template('index.html', path.join(targetDir, filename + '.html'));
        this.template('index.test.js', path.join(targetDir, filename + '.test.js'));
        done();

    },

    end: function() {

    }
});

module.exports = DirectiveGenerator;