'use strict';
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var constants = require('../common/constants')();

gulp.task('eslint', false, function() {
    return gulp.src(constants.lint)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint', 'Lint all javascript files.', ['eslint']);