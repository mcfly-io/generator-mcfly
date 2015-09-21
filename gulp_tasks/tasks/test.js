'use strict';
var gulp = require('gulp');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();
var mocha = $.mocha;
var istanbul = $.istanbul;

var constants = require('../common/constants')();

gulp.task('mocha', 'Runs mocha unit tests', function(done) {
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

gulp.task('test', 'Lint, then run all unit tests', function(done) {
    runSequence(
        'lint', ['mocha'],
        done
    );
});
