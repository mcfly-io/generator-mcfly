'use strict';
var gulp = require('gulp');
var ginject = require('gulp-inject');
var Q = require('q');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

/**
 * Inject the list of angular modules of the main.js file
 * @param {String} directory - The folder containing the modules
 * @param {String[]} modules - The list of modules
 *
 * @returns {Promise} - An empty promise after the injection is done
 */
exports.injectModules = function(directory, modules) {
    var deferred = Q.defer();
    var mainFile = path.join(directory, 'main.js');
    gulp.src(mainFile)
        .pipe(ginject(gulp.src(mainFile, {
            read: false
        }), {
            starttag: 'var app = angular.module(namespace, [',
            endtag: ']);',
            transform: function() {
                return _.map(_.sortBy(_.uniq(modules)), function(module) {
                    return '    require(\'./' + module + '\')(namespace).name';
                }).join(',' + '\n');
            }
        }))
        .pipe(gulp.dest(directory))
        .on('error', function(err) {
            deferred.reject(err);
        })
        .on('end', function() {
            deferred.resolve();
        });
    return deferred.promise;
};

/**
 * Inject the list of angular sub components of the module file
 * @param {Generator} generator - The generator
 * @param {String} directory - The module folder
 *
 * @returns {Promise} - An empty promise after the injection is done
 */
exports.injectSubComponent = function(generator, directory) {
    var deferred = Q.defer();
    var mainFile = path.join(directory, 'index.js');

    generator.getDirectories(directory)
        .then(function(components) {
            gulp.src(mainFile)
                .pipe(ginject(gulp.src(mainFile, {
                    read: false
                }), {
                    starttag: '// inject:folders start',
                    endtag: '// inject:folders end',
                    transform: function() {
                        return _.map(_.sortBy(_.uniq(components)), function(component) {
                            return 'require(\'./' + component + '\')(app);';
                        }).join('\n    ') + '\n';
                    }
                }))
                .pipe(gulp.dest(directory))
                .on('error', function(err) {
                    deferred.reject(err);
                })
                .on('end', function() {
                    deferred.resolve();
                });

        });

    return deferred.promise;
};

/**
 * Inject the list of angular components of the same kind in their index.js file
 * @param {String} directory - The folder containing the components
 *
 * @returns {Promise} - An empty promise after the injection is done
 */
exports.injectComponent = function(directory) {
    var deferred = Q.defer();
    var mainFile = path.join(directory, 'index.js');
    var searchFiles = [
        path.join(directory, '**/*.js'),
        '!' + path.join(directory, 'index.js'),
        '!' + path.join(directory, '**/*.test.js'),
        '!' + path.join(directory, '**/*.tests.js'),
        '!' + path.join(directory, '**/*.spec.js'),
        '!' + path.join(directory, '**/*.specs.js')
    ];

    gulp.src(mainFile)
        .pipe(ginject(gulp.src(searchFiles, {
            read: false
        }), {
            starttag: '// inject:start',
            endtag: '// inject:end',
            transform: function(filepath) {
                var paths = filepath.split('/');
                var filename = paths[paths.length - 1];
                filename = filename.replace('.js', '');
                return 'require(\'./' + filename + '\')(app);';
            }
        }))
        .pipe(gulp.dest(directory))
        .on('error', function(err) {
            deferred.reject(err);
        })
        .on('end', function() {
            deferred.resolve();
        });
    return deferred.promise;
};

/**
 * Create an index.js file for an angular component (service, directive, etc..)
 * for referencing all the components of same kind in the folder
 * @param {Generator} generator - The generator
 * @param {String} targetDir - The folder were the file should be created
 * @param {String} sourceDir - The folder were the template file is located (for example '../module/services')
 *
 * @returns {void}
 */
exports.createIndexFile = function(generator, targetDir, sourceDir) {
    if(!fs.existsSync(path.join(targetDir, 'index.js'))) {
        generator.template(sourceDir + '/index.js', path.join(targetDir, 'index.js'));
    }
};