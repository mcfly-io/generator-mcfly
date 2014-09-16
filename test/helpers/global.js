'use strict';

var _ = require('lodash');

// SINON
global.sinon = require('sinon');

// ASSERTS
global.assert = require('assert');
// mixin yeoman and chai assert modules
_.extend(global.assert, require('yeoman-generator').assert);
_.extend(global.assert, require('chai').assert);

// EXPECT
global.expect = require('chai').expect;