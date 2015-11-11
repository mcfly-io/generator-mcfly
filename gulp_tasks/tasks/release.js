'use strict';

global.Promise = require('bluebird');
var gulp = require('gulp');
var args = require('yargs').argv;
var exec = require('child_process').exec;
var bump = require('gulp-bump');
var tap = require('gulp-tap');
var XML = require('node-jsxml').XML;
var git = require('gulp-git');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var GitHubApi = require('github');
var runSequence = require('run-sequence').use(gulp);
var del = require('del');
var inquirer = require('inquirer');
var githubUsername = require('github-username');
var helper = require('../common/helper');
var constants = require('../common/constants')();

/**
 * Bumps any version in the constants.versionFiles
 *
 * USAGE:
 * gulp bump --minor (or --major or --prerelease or --patch which is the default)
 * - or -
 * gulp bump --ver=1.2.3
 * @param {function} cb - The gulp callback
 */
gulp.task('bump', false, function(cb) {
    var bumpType = 'patch';
    // major.minor.patch
    if (args.patch) {
        bumpType = 'patch';
    }
    if (args.minor) {
        bumpType = 'minor';
    }
    if (args.major) {
        bumpType = 'major';
    }
    if (args.prerelease) {
        bumpType = 'prerelease';
    }
    bumpType = process.env.BUMP || bumpType;

    var version;
    var srcjson = helper.filterFiles(constants.versionFiles, '.json');
    var srcxml = helper.filterFiles(constants.versionFiles, '.xml');

    // first we bump the json files
    gulp.src(srcjson)
        .pipe(gulpif(args.ver !== undefined, bump({
            version: args.ver
        }), bump({
            type: bumpType
        })))
        .pipe(tap(function(file) {
            if (!version) {
                var json = JSON.parse(String(file.contents));
                version = json.version;
            }
        }))
        .pipe(gulp.dest('./'))
        .on('end', function() {
            // then after we have the correct value for version, we take care of the xml files
            if (srcxml.length > 0) {
                gulp.src(srcxml)
                    .pipe(tap(function(file) {
                        var xml = new XML(String(file.contents));
                        xml.attribute('version').setValue(version);
                        file.contents = Buffer.concat([new Buffer(xml.toXMLString())]);
                    }))
                    .pipe(gulp.dest('./' + constants.clientFolder))
                    .on('end', function() {
                        cb();
                    });
            } else {
                cb();
            }

        });

});

gulp.task('commit', false, ['bump'], function() {
    var pkg = helper.readJsonFile('./package.json');
    var message = 'docs(changelog): version ' + pkg.version;
    return gulp.src(constants.versionFiles)
        .pipe(git.add({
            args: '.'
        }))
        .pipe(git.commit(message));
});

gulp.task('tag', false, ['commit'], function(cb) {
    var pkg = helper.readJsonFile('./package.json');
    var v = 'v' + pkg.version;
    var message = pkg.version;
    git.tag(v, message, function(err) {
        if (err) {
            throw new Error(err);
        }
        cb();
    });
});

gulp.task('push', false, ['tag'], function(cb) {
    exec('git push origin master  && git push origin master --tags', function(err) {
        if (err) {
            throw new Error(err);
        }
        cb();
    });
});

// gulp.task('npm', ['push'], function(done) {
//     spawm('npm', ['publish'], {
//         stdio: 'inherit'
//     }).on('close', done);
// });

gulp.task('release', 'Publish a new release version.', ['push']);

// ############GITHUB SECTION#########

var github = new GitHubApi({
    version: '3.0.0',
    protocol: 'https',
    timeout: 0
});

var gitGetEmailAsync = Promise.promisify(git.exec.bind(git, {
    args: 'config --get user.email',
    quiet: true
}));

var githubUsernameAsync = Promise.promisify(githubUsername);

var inquireAsync = function(result) {
    return new Promise(function(resolve, reject) {
        inquirer.prompt(result.questions, function(answers) {
            // only resolving what we need
            resolve({
                username: answers.username || result.username,
                password: answers.password
            });
        });
    });
};

var githubAuthSetupAndTestAsync = function(result) {
    return new Promise(function(resolve, reject) {
        github.authenticate({
            type: 'basic',
            username: result.username,
            password: result.password
        });
        github.misc.rateLimit({}, function(err, res) {
            if (err) {
                reject(gutil.colors.red('GitHub auth failed! ') + 'Response from server: ' + gutil.colors.yellow(err.message));
            }
            resolve(gutil.colors.green('GitHub auth successful!'));
        });
    });
};

gulp.task('githubAuth', false, function(cb) {
    return gitGetEmailAsync()
        .then(githubUsernameAsync)
        .catch(function() {
            //gutil.log(gutil.colors.red(err));
            return null;
        })
        .then(function(username) {
            return {
                username: username,
                questions: [{
                    type: 'input',
                    message: 'Please enter your GitHub username',
                    name: 'username',
                    default: username,
                    validate: function(input) {
                        return input !== '';
                    },
                    when: function() {
                        return username === null;
                    }
                }, {
                    type: 'password',
                    message: 'Please enter your GitHub password',
                    name: 'password',
                    validate: function(input) {
                        return input !== '';
                    }
                }]
            };
        })
        .then(inquireAsync)
        .then(githubAuthSetupAndTestAsync)
        .tap(gutil.log);
});

gulp.task('release:createRelease', false, function(cb) {
    var pkg = helper.readJsonFile('./package.json');
    var v = 'v' + pkg.version;
    var message = pkg.version;
    var ownerRepo = constants.repository.split('/').slice(-2);

    return gulp.src('CHANGELOG.md')
        .pipe(tap(function(file) {
            var body = file.contents.toString();
            body = body.slice(body.indexOf('###'));
            var msg = {
                owner: ownerRepo[0],
                repo: ownerRepo[1],
                tag_name: v,
                name: v + ': version ' + message,
                body: body
            };
            github.releases.createRelease(msg, function(err, res) {
                if (err) {
                    gutil.log(gutil.colors.red('Error: ' + err));
                } else {
                    del('CHANGELOG.md');
                }
            });
        }));
});

gulp.task('delay', false, function(cb) {
    setTimeout(cb, 3000);
});

gulp.task('release:full', 'Publish a new release version on GitHub and upload a changelog.', function() {
    return runSequence('githubAuth', 'changelog', 'push', 'delay', 'release:createRelease');
});
