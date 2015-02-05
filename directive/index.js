'use strict';
var path = require('path');
var utils = require('../utils');
var Class = require('../class/component.js')('directives', 'directive');

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

        this.directivename = this._.camelize(this._.slugify(this._.humanize(this.directivename)));

    },

    initializing: function() {
        DirectiveGenerator.__super__.initializing.apply(this, arguments);
    },

    prompting: function() {

        var done = this.async();
        DirectiveGenerator.__super__.prompting.call(this, done);
    },

    configuring: function() {
        this.htmlname = this._.dasherize(this.directivename);
        this.compile = this.options.compile;
    },

    writing: function() {
        var done = this.async();
        this.sourceRoot(path.join(__dirname, '../templates/' + 'directive'));
        var targetDir = path.join(this.clientFolder, 'scripts', this.modulename, 'directives');
        this.mkdir(targetDir);

        // make sure the fitlers/index.js exist
        utils.createIndexFile(this, '../component', targetDir);
        if(this.compile) {
            this.template('index-compile.js', path.join(targetDir, this.directivename + '.js'));
        } else {
            this.template('index.js', path.join(targetDir, this.directivename + '.js'));
        }
        this.template('index.html', path.join(targetDir, this.directivename + '.html'));
        this.template('index.test.js', path.join(targetDir, this.directivename + '.test.js'));
        done();

    },

    end: function() {

    }
});

module.exports = DirectiveGenerator;
