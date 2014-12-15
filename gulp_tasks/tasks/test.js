'use strict';
var gulp = require('gulp');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();
var mocha = $.mocha;
var istanbul = $.istanbul;
var karma = $.karma;
var gutil = require('gulp-util');
var chalk = require('chalk');

var constants = require('../common/constants')();

gulp.task('mocha', function(done) {
    gulp.src(constants.mocha.libs)
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(constants.mocha.tests)
                //.pipe(plumber())
                .pipe(mocha({
                    reporter: 'spec',
                    globals: './test/helpers/global.js',
                    timeout: constants.mocha.timeout
                }))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov', 'json', 'text', 'text-summary', 'cobertura']
                }))
                .on('end', done);
        });
});

gulp.task('karma', function() {
    gulp.src(['no need to supply files because everything is in config file'])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        })).on('error', function() {
            gutil.log(chalk.red('(ERROR)'), 'karma');
        });
});

gulp.task('test', function(done) {
    runSequence(
        'lint', ['mocha'],
        done
    );
});