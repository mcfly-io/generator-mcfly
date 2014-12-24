'use strict';
try {
    var gutil = require('gulp-util');
    var chalk = require('chalk');
    gutil.log(chalk.yellow('Executing ./bin/protractor-fix-install'));
    try {
        var pconfig = require('protractor/config.json');

        pconfig.webdriverVersions.selenium = '2.43.1';

        require('fs').writeFile(
            './node_modules/protractor/config.json', JSON.stringify(pconfig)
        );

    } catch(err) {
        gutil.log(chalk.yellow('Error in ./bin/protractor-fix-install'), chalk.red(err.message));
    }
} catch(err) {
    console.log('Error in ./bin/protractor-fix-install', err.message);
}
