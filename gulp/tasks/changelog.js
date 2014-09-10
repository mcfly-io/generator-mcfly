'use strict';

var gulp = require('gulp');
var changelog = require('conventional-changelog');
var argv = require('yargs').argv;
var marked = require('marked');
var fs = require('fs');
var q = require('q');
var pkg = require('../../package.json');
var path = require('path');
var gutil = require('gulp-util');

var repository = '';
if(repository.length <= 0) {
    throw new Error('The repository cannot be empty');
}

var makeChangelog = function(options) {
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

gulp.task('changelog', function() {
    var dest = argv.dest || 'CHANGELOG.md';
    var toHtml = argv.html || false;
    return makeChangelog(argv).then(function(log) {
        if(toHtml) {
            log = marked(log, {
                gfm: true
            });
        }
        fs.writeFileSync(dest, log);
    });
});