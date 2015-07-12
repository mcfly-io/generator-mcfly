'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var changelog = require('conventional-changelog');
var argv = require('yargs').argv;
var fs = require('fs');
var q = require('q');
var path = require('path');
var gutil = require('gulp-util');
var exec = $.exec;
var concat = $.concat;
var order = $.order;
var helper = require('../common/helper');

var constants = require('../common/constants')();

var repository = constants.repository;

var makeChangelog = function(options) {
    if (repository.length <= 0) {
        throw new Error('The repository cannot be empty');
    }
    var pkg = helper.readJsonFile('./package.json');
    var codename = pkg.codename;
    var file = options.standalone ? '' : path.join(__dirname, 'CHANGELOG.md');
    var subtitle = options.subtitle || '"' + codename + '"';
    var from = options.from;
    var version = options.version || pkg.version;
    var deferred = q.defer();
    changelog({
        repository: repository,
        version: version,
        subtitle: subtitle,
        file: file,
        from: from
    }, function(err, log) {
        if (err) {
            deferred.reject(err);
        } else {
            gutil.log('LOG', log);
            deferred.resolve(log);
        }
    });
    return deferred.promise;
};

gulp.task('changelog:conventional', false, function(cb) {
    var dest = argv.dest || 'CHANGELOG.md';
    return makeChangelog(argv).then(function(log) {
        fs.writeFileSync(dest, log);
        cb();
    });
});

gulp.task('changelog:script', false, function(done) {
    var pkg = helper.readJsonFile('./package.json');
    var options = argv;
    var version = options.version || pkg.version;
    var from = options.from || '';

    gulp.src('')
        .pipe(exec('node ./gulp_tasks/common/changelog-script.js ' + version + ' ' + from, {
            pipeStdout: true
        }))
        .pipe(concat('updates.md'))
        .pipe(helper.addSrc('CHANGELOG.md'))
        .pipe(order(['updates.md', 'CHANGELOG.md']))
        .pipe(concat('CHANGELOG.md'))
        .pipe(gulp.dest('./'))
        .on('end', done);
});

gulp.task('changelog', 'Generates a CHANGELOG.md file.', ['changelog:script']);