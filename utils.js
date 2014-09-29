'use strict';
var gulp = require('gulp');
var ginject = require('gulp-inject');
var Q = require('q');
var path = require('path');
var _ = require('lodash');

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
                    return 'require(\'./' + module + '\')(namespace).name';
                }).join(',' + '\n    ') + '\n';
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
            starttag: 'module.exports = function(app) {',
            endtag: '};',
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