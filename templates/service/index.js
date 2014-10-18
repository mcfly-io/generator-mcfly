'use strict';
var servicename = '<%= servicename %>';

module.exports = function(app) {

    var dependencies = [];
    function service() {<% if (servicetype === 'factory') { %>
        var add = function(a, b) {
            return a + b;
        };

        return {
            add : add
        };
<% } %><% if(servicetype === 'provider') { %>
       var isInitialized = false;     
       var init = function() {
           isInitialized = true;
       }
       return {
          // initialization
           init: init,

           $get: ['$q',
               function($q) {
                   var add = function(a, b) {
                       return a + b;
                   };

                   return {
                       isInitialized: isInitialized,
                       add: add
                   };
               }
           ]
       };
<% } %>
    }
    service.$inject = dependencies;
<% if (servicetype === 'factory') { %>    app.factory(app.name + '.' + servicename, service);
};
<% } %>
<% if (servicetype === 'service') { %>    app.service(app.name + '.' + servicename, service);
};
<% } %>
<% if (servicetype === 'provider') { %>   app.provider(app.name + '.' + servicename, service);
};
<% } %>
