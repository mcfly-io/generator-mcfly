'use strict';
// this file is used by webpack to create a bundle of all unit tests and then is passed to karma
var testsContext = require.context('.', true, /.+\.test\.jsx?$/);
var keys = testsContext.keys();

keys.forEach(testsContext);
