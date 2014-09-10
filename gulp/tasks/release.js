'use strict';

var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')();
var exec = require('child_process').exec;
var fs = require('fs');
var stripJsonComments = require('strip-json-comments');
var bump = $.bump;
var git = $.git;
var gulpif = $.
if;
var constants = require('../common/constants')();

var readTextFile = function(filename) {
    var body = fs.readFileSync(filename, 'utf8');
    return body;
};

var readJsonFile = function(filename) {
    var body = readTextFile(filename);
    return JSON.parse(stripJsonComments(body));
};

/**
 * Bumps any version in the constants.versionFiles
 *
 * USAGE:
 * gulp bump --minor (or --major or --prerelease or --patch which is the default)
 * - or -
 * gulp bump --ver=1.2.3
 * @return {undefined} Nothing
 */
gulp.task('bump', function() {
    var bumpType = 'patch';
    // major.minor.patch
    if(args.patch) {
        bumpType = 'patch';
    }
    if(args.minor) {
        bumpType = 'minor';
    }
    if(args.major) {
        bumpType = 'major';
    }
    if(args.prerelease) {
        bumpType = 'prerelease';
    }
    bumpType = process.env.BUMP || bumpType;

    return gulp.src(constants.versionFiles)
        .pipe(gulpif(args.ver !== undefined, bump({
            version: args.ver
        }), bump({
            type: bumpType
        })))
        .pipe(gulp.dest('./'));

});

gulp.task('commit', ['bump'], function() {
    var pkg = readJsonFile('./package.json');
    var message = pkg.version;
    return gulp.src(constants.versionFiles)
        .pipe(git.add({
            args: '.'
        }))
        .pipe(git.commit(message));
});

gulp.task('tag', ['commit'], function() {
    var pkg = readJsonFile('./package.json');
    var v = 'v' + pkg.version;
    var message = pkg.version;
    git.tag(v, message);
});

gulp.task('push', ['tag'], function() {
    exec('git push origin master  && git push origin master --tags', function(err) {
        if(err) {
            throw new Error(err);
        }
    });
});

// gulp.task('npm', ['push'], function(done) {
//     spawm('npm', ['publish'], {
//         stdio: 'inherit'
//     }).on('close', done);
// });

gulp.task('release', ['push']);