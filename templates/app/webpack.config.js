'use strict';

var path = require('path');
var webpack = require('webpack');
var helper = require('./gulp_tasks/common/helper');

module.exports = {
    cache: true,
    context: path.join(__dirname, 'client/scripts'),
    output: {
        // devtoolModuleFilenameTemplate: function(info) {
        //     //console.log(module);
        //     return 'scripts/' + info.resourcePath.replace(__dirname, '../..').replace('/~/', '/node_modules/');
        // },
        devtoolModuleFilenameTemplate: 'scripts/[resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    stats: {
        colors: true,
        reasons: true
    },
    resolve: {
        alias: {
            'ionic': 'ionic-sdk/release/js/ionic.js',
            'ionic-angular': 'ionic-sdk/release/js/ionic-angular.js',
            'unitHelper': './test/unit/unitHelper.js',
            'lbServices': './client/scripts/lbServices.js'
        },
        root: [
            path.resolve(path.join(__dirname, 'node_modules')),
            path.resolve(path.join(__dirname, 'bower_components'))
        ],
        modulesDirectories: ['node_modules', 'bower_components']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            cacheable: true,
            loader: 'babel-loader',
            query: {
                stage: 0,
                optional: ['runtime', 'es7.asyncFunctions'],
                //retainLines: true,
                cacheDirectory: true
            }
        }, {
            test: /\.js$/,
            loader: 'transform/cacheable?brfs!transform/cacheable?envify',
            exclude: /(node_modules|bower_components)/,
            cacheable: true
        }, {
            test: /\.css$/,
            loader: 'style!css',
            cacheable: true
                //exclude: /(node_modules|bower_components)/
        }, {
            test: /\.scss$/,
            loader: 'style!css!sass?sourceMap',
            cacheable: true,
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.sass$/,
            // Passing indentedSyntax query param to node-sass
            loader: 'style!css!sass?indentedSyntax&sourceMap',
            cacheable: true,
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.less$/,
            loader: 'style!css!less?strictMath&noIeCompat',
            cacheable: true,
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.html$/,
            cacheable: true,
            loader: 'html'
        }, {
            test: /\.json$/,
            cacheable: true,
            loader: 'json'
        }, {
            test: /\.woff/,
            loader: 'url?prefix=font/&limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.ttf/,
            loader: 'file?prefix=font/'
        }, {
            test: /\.eot/,
            loader: 'file?prefix=font/'
        }, {
            test: /\.svg/,
            loader: 'file?prefix=font/'
        }]
    },
    plugins: [
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('package.json', ['main']),
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ]),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.BannerPlugin(helper.getBanner(), {
            raw: true
        })

    ]
};
