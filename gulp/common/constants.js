'use strict';

module.exports = function() {
    var constants = {
        versionFiles: ['./package.json', './bower.json'],
        growly: {
            successIcon: 'node_modules/karma-growl-reporter/images/success.png',
            failedIcon: 'node_modules/karma-growl-reporter/images/failed.png'
        },
        lint: ['./app/**/*.js', './server/**/*.js', 'gulpfile.js', 'gulp/**/*.js', 'karam.conf.js', 'test/**/*.js'],

        browserify: {
            src: './client/scripts/main.js',
            dest: './client/scripts',
            bundleName: 'bundle.js'
        },

        serve: {
            root: 'client',
            host: '0.0.0.0',
            livereload: 9000,
            port: 5000
        }
    };

    return constants;
};