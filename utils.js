'use strict';

global.Promise = require('bluebird');
var gulp = require('gulp');
var ginject = require('gulp-inject');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var subcomponents = require('./class/subcomponents.js');
/**
 * Inject the list of angular modules of the main.js file
 * @param {String} directory - The folder containing the modules
 * @param {String} suffix - The suffix of the target application
 * @param {String[]} modules - The list of modules
 *
 * @returns {Promise} - An empty promise after the injection is done
 */
exports.injectModules = function(directory, suffix, modules) {
    return new Promise(function(resolve, reject) {
        var mainFile = path.join(directory, 'main' + suffix + '.js');

        gulp.src(mainFile)
            .pipe(ginject(gulp.src(mainFile, {
                read: false
            }), {
                starttag: '// inject:modules start',
                endtag: '// inject:modules end',
                transform: function() {
                    return _.map(_.sortBy(_.uniq(modules)), function(module) {
                        return 'require(\'./' + module + '\')(namespace).name';
                    }).join(',' + '\n    ');
                }
            }))
            .pipe(gulp.dest(directory))
            .on('error', function(err) {
                reject(err);
            })
            .on('end', function() {
                resolve();
            });
    });
};

/**
 * Inject the list of angular sub components of the module file
 * @param {Generator} generator - The generator
 * @param {String} directory - The module folder
 *
 * @returns {Promise} - An empty promise after the injection is done
 */
exports.injectSubComponent = function(generator, directory) {
    return new Promise(function(resolve, reject) {
        var mainFile = path.join(directory, 'index.js');

        generator.getDirectories(directory)
            .then(function(components) {

                // excluding the 'views' folder as it only contains html partials, as well as unexpected folders (styles, images, etc...) that should not be required
                components = _.intersection(components, subcomponents);

                gulp.src(mainFile)
                    .pipe(ginject(gulp.src(mainFile, {
                        read: false
                    }), {
                        starttag: '// inject:folders start',
                        endtag: '// inject:folders end',
                        transform: function() {
                            return _.map(_.sortBy(_.uniq(components)), function(component) {
                                return 'require(\'./' + component + '\')(app);';
                            }).join('\n');
                        }
                    }))
                    .pipe(gulp.dest(directory))
                    .on('error', function(err) {
                        reject(err);
                    })
                    .on('end', function() {
                        resolve();
                    });

            });

    });
};

/**
 * Inject the list of angular components of the same kind in their index.js file
 * @param {String} directory - The folder containing the components
 *
 * @returns {Promise} - An empty promise after the injection is done
 */
exports.injectComponent = function(directory) {
    return new Promise(function(resolve, reject) {
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
                reject(err);
            })
            .on('end', function() {
                resolve();
            });
    });
};

/**
 * Create an index.js file for an angular component (service, directive, etc..)
 * for referencing all the components of same kind in the folder
 * @param {Generator} generator - The generator
 * @param {String} sourceDir - The folder were the template file is located (for example '../module/services' or '../component')
 * @param {String} targetDir - The folder were the file should be created
 */
exports.createIndexFile = function(generator, sourceDir, targetDir) {
    if (!fs.existsSync(path.join(targetDir, 'index.js'))) {
        generator.template(sourceDir + '/index.js', path.join(targetDir, 'index.js'));
    }
};

/**
 * Get the angular modules list based on the choice of frameworks (ionic, famous, etc...) for the generator
 * @param {Generator} generator - The generator
 * @returns {String} - The list of ng modules as a comma separated string
 */
exports.getNgModules = function(generator) {
    var retVal = [];
    if (generator.ionic) {
        retVal.push('\'ionic\'');
    }
    if (generator.famous) {
        retVal.push('\'famous.angular\'');
    }
    if (generator.ngCordova) {
        retVal.push('\'ngCordova\'');
    }
    if (generator.material) {
        retVal.push('\'ngMaterial\'');
    }
    return retVal.join(', ');
};
