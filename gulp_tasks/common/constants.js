'use strict';

var path = require('path');

module.exports = function() {

    var constants = {
        repository: 'https://github.com/thaiat/generator-mcfly',
        versionFiles: ['./package.json', './bower.json'],
        lint: ['./app/**/*.js', './class/**/*.js', './module/**/*.js', './service/**/*.js', 'filter/**/*.js', 'constant/**/*.js', 'value/**/*.js', 'directive/**/*.js', 'remove/**/*.js', 'require/**/*.js', 'target/**/*.js', 'gulpfile.js', 'gulp/**/*.js', 'karam.conf.js', 'test/**/*.js', 'utils.js'],
        mocha: {
            libs: ['app/**/*.js', 'class/**/*.js', 'module/**/*.js', 'controller/**/*.js', 'service/**/*.js', 'filter/**/*.js', 'constant/**/*.js', 'value/**/*.js', 'directive/**/*.js', 'require/**/*.js', 'target/**/*.js'],
            tests: ['test/**/*.js'],
            globals: 'test/helpers/globals.js',
            timeout: 5000
        }
    };

    return constants;
};
