'use strict';
var filtername = '<%= filtername %>';

module.exports = function(app) {

    var deps = [];

    function filter() {
        return function(items, filterValue) {
            if (!filterValue) {
                return items;
            }

            var filtered = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                //custom filter logic here
                filtered.push(item);
            }
            return filtered;
        };
    }

    filter.$inject = deps;
    app.filter(filtername, filter);
};