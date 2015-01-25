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
var helper = require('../common/helper');

var constants = require('../common/constants')();

var repository = constants.repository;
if(repository.length <= 0) {
    throw new Error('The repository cannot be empty');
}

var makeChangelog = function(options) {
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
        if(err) {
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

gulp.task('changelog:script', false, function(cb) {
    var pkg = helper.readJsonFile('./package.json');
    var options = argv;
    var version = options.version || pkg.version;
    var from = options.from || '';
    var streamqueue = require('streamqueue');
    var stream = streamqueue({
        objectMode: true
    });

    stream.queue(gulp.src('').pipe(exec('node ./gulp_tasks/common/changelog-script.js ' + version + ' ' + from, {
        pipeStdout: true
    })));
    stream.queue(gulp.src('CHANGELOG.md'));

    stream.done()
        .pipe(concat('CHANGELOG.md'))
        .pipe(gulp.dest('./'))
        .on('end', cb);
});

gulp.task('changelog', 'Generates a CHANGELOG.md file.', ['changelog:script']);
