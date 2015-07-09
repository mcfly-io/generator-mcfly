'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var map = require('map-stream');
var combine = require('stream-combiner');
var chalk = require('chalk');
var _ = require('lodash');
var jshint = $.jshint;
var jscs = $.jscs;
var eslint = $.eslint;
var gutil = $.util;
var plumber = $.plumber;
var constants = require('../common/constants')();

gulp.task('jshint', false, function() {
    var hasError = false;
    var hasShown = false;
    var successReporter = map(function(file, cb) {
        if (!file.jshint.success) {
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
            throw new Error('jshint failed');
        })
        .pipe(map(function() {
            if (!hasError && !hasShown) {
                hasShown = true;
                gutil.log(chalk.green('All Jshint files passed'));

            }

        }));
});

gulp.task('jscs', false, function() {
    var hasError = false;
    var combined = combine(
        gulp.src(constants.lint),
        jscs());

    combined.on('error', function(err) {
        hasError = true;

        gutil.log(err.toString());
        gutil.log(chalk.red('Jscs failed'));

        throw new Error('jscs failed');
    });

    combined.on('end', function() {
        if (!hasError) {
            gutil.log(chalk.green('All Jscs files passed'));

        }
    });

});

gulp.task('eslint', false, function() {
    var hasError = false;
    var hasShown = false;
    gulp.src(constants.lint)
        .pipe(eslint())
        .pipe(eslint.format())
        .on('data', function(file) {

            if (file.eslint.messages && file.eslint.messages.length && _.any(file.eslint.messages, function(item) {
                    return item.severity === 2;
                })) {
                hasError = true;
            }
        })
        .on('end', function() {
            if (!hasError && !hasShown) {
                hasShown = true;
                gutil.log(chalk.green('All EsLint files passed'));

            } else {
                gutil.log(chalk.red('EsLint failed'));

                throw new Error('eslint failed');
            }

        });

});

gulp.task('static', false, function() {

    var status = {
        hasShown: false,
        hasError: false,
        errs: []
    };
    return gulp.src(constants.lint)
        .pipe(plumber({
            errorHandler: function(err) {
                if (err.plugin === 'gulp-jscs') {
                    gutil.log(err.toString());
                }
                status.hasError = true;
                status.errs.push(err);
                if (!status.hasShown) {
                    status.hasShown = true;

                    this.emit('end');
                }
            }
        }))
        .pipe(jshint({
            lookup: true
        }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jscs())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(jshint.reporter('fail'))
        .pipe(eslint.failOnError())
        .on('end', function() {
            if (status.hasError) {
                gutil.log(chalk.red('lint failed'));
                throw new Error('lint_error');

            } else {
                gutil.log(chalk.green('All lint files passed'));

            }
        });

});
//gulp.task('lint', ['jshint', 'jscs', 'eslint']);
gulp.task('lint', 'Lint all javascript files.', ['static']);