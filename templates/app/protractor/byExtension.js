'use strict';
var byObj;

var ngClick = function(handler) {
    return byObj.css('[ng-click="' + handler + '"]');
};

var extendsBy = function(by) {
    byObj = by;
    byObj.ngClick = ngClick;
};

module.exports = {
    extendsBy: extendsBy
};
