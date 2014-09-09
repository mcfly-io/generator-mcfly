'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var map = require('map-stream');
var combine = require('stream-combiner');
var chalk = require('chalk');
var growly = require('growly');
var _ = require('lodash');
var jshint = $.jshint;
var jscs = $.jscs;
var eslint = $.eslint;
var gutil = $.util;
var constants = require('../common/constants')();

gulp.task('jshint', function() {
    var hasError = false;
    var hasShown = false;
    var successReporter = map(function(file, cb) {
        if(!file.jshint.success) {
            hasError = true;
        }
        cb(null, file);
    });

    gulp.src(constants.lint)
        .pipe(jshint({
            lookup: true
        }))
        .pipe(successReporter)
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', function() {
            gutil.log(chalk.red('Jshint failed'));
            growly.notify('One or more jshint error', {
                title: 'FAILED - JsHint',
                icon: constants.growly.failedIcon
            });
            throw new Error('jshint failed');
        })
        .pipe(map(function() {
            if(!hasError && !hasShown) {
                hasShown = true;
                gutil.log(chalk.green('All Jshint files passed'));
                growly.notify('All files passed', {
                    title: 'PASSED - JsHint',
                    icon: constants.growly.successIcon
                });

            }

        }));
});

gulp.task('jscs', function() {
    var hasError = false;
    var combined = combine(
        gulp.src(constants.lint),
        jscs());

    combined.on('error', function(err) {
        hasError = true;

        gutil.log(err.toString());
        gutil.log(chalk.red('Jscs failed'));
        growly.notify('One or more jscs error', {
            title: 'FAILED - Jscs',
            icon: constants.growly.failedIcon
        });
        throw new Error('jscs failed');
    });

    combined.on('end', function() {
        if(!hasError) {
            gutil.log(chalk.green('All Jscs files passed'));
            growly.notify('All files passed', {
                title: 'PASSED - Jscs',
                icon: constants.growly.successIcon
            });

        }
    });

});

gulp.task('eslint', function() {
    var hasError = false;
    var hasShown = false;
    gulp.src(constants.lint)
        .pipe(eslint())
        .pipe(eslint.format())
        .on('data', function(file) {

            if(file.eslint.messages && file.eslint.messages.length && _.any(file.eslint.messages, function(item) {
                return item.severity === 2;
            })) {
                hasError = true;
            }
        })
        .on('end', function() {
            if(!hasError && !hasShown) {
                hasShown = true;
                gutil.log(chalk.green('All EsLint files passed'));
                growly.notify('All files passed', {
                    title: 'PASSED - EsLint',
                    icon: constants.growly.successIcon
                });

            } else {
                gutil.log(chalk.red('EsLint failed'));
                growly.notify('One or more eslint error', {
                    title: 'FAILED - EsLint',
                    icon: constants.growly.failedIcon
                });
                throw new Error('eslint failed');
            }

        });

});

gulp.task('lint', ['jshint', 'jscs', 'eslint']);