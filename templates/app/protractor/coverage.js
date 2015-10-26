'use strict';
var istanbul = require('istanbul');
var Collector = require('istanbul').Collector;
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var generateCoverageReports = function(coveragePath) {
    var files = fs.readdirSync(coveragePath);
    var collector = new Collector();
    files.forEach(function(file) {
        if (file.indexOf('.json') > 0 && file.indexOf('coverage-final.json') < 0) {
            var json = JSON.parse(fs.readFileSync(coveragePath + '/' + file, 'utf-8'));
            collector.add(json);
        }
    });

    var reportText = istanbul.Report.create('text');
    reportText.writeReport(collector, true);

    var reportTextSummary = istanbul.Report.create('text-summary');
    reportTextSummary.writeReport(collector, true);

    var reportLcov = istanbul.Report.create('lcov', {
        dir: coveragePath
    });
    reportLcov.writeReport(collector, true);

    var reportJson = istanbul.Report.create('json', {
        dir: coveragePath
    });
    reportJson.writeReport(collector, true);

    var reportCobertura = istanbul.Report.create('cobertura', {
        dir: coveragePath,
        file: 'coverage.xml'
    });
    reportCobertura.writeReport(collector, true);

};

var cleanFolder = function(coveragePath) {
    rimraf.sync(coveragePath);
    mkdirp.sync(coveragePath);
};

module.exports = {
    cleanFolder: cleanFolder,
    generateCoverageReports: generateCoverageReports
};
