# generator-angular-famous-ionic 
[![NPM version](https://badge.fury.io/js/generator-angular-famous-ionic.svg)](http://badge.fury.io/js/generator-angular-famous-ionic) [![Downloads](http://img.shields.io/npm/dm/generator-angular-famous-ionic.svg)](http://badge.fury.io/js/generator-angular-famous-ionic)   
[![Build Status](https://travis-ci.org/thaiat/generator-angular-famous-ionic.svg?branch=master)](https://travis-ci.org/thaiat/generator-angular-famous-ionic) [![Test Coverage](https://codeclimate.com/github/thaiat/generator-angular-famous-ionic/badges/coverage.svg)](https://codeclimate.com/github/thaiat/generator-angular-famous-ionic) [![Code Climate](https://codeclimate.com/github/thaiat/generator-angular-famous-ionic/badges/gpa.svg)](https://codeclimate.com/github/thaiat/generator-angular-famous-ionic)   
[![Dependency Status](https://david-dm.org/thaiat/generator-angular-famous-ionic.svg)](https://david-dm.org/thaiat/generator-angular-famous-ionic) [![devDependency Status](https://david-dm.org/thaiat/generator-angular-famous-ionic/dev-status.svg)](https://david-dm.org/thaiat/generator-angular-famous-ionic#info=devDependencies) [![peerDependency Status](https://david-dm.org/thaiat/generator-angular-famous-ionic/peer-status.svg)](https://david-dm.org/thaiat/generator-angular-famous-ionic#info=peerDependencies)    


> A Yeoman generator for scaffolding an application using angular, browserify, ionic and famous.

[![NPM](https://nodei.co/npm/generator-angular-famous-ionic.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/generator-angular-famous-ionic)

## Description
This generator will scaffold for you an application using angularjs, browserify, and either ionic framwork or famo.us (even both).

The project has the following capabilities:
* angularjs best pratices (feature folder structure)
* SASS enabled
* jshint, jscsc, eslint enabled (so you shouldn't have any typo left in your js files !)
* karma configured with browserify including code coverage
* browserSync


> NOTE:
> This generator is using generator-sublime to scaffold common dot files (.jshintrc, .eslintrc, etc...).   
> Check it out https://www.npmjs.org/package/generator-sublime

## Usage

Install `generator-angular-famous-ionic`:
```
npm install -g generator-angular-famous-ionic
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo angular-famous-ionic`, optionally passing an app name:
```
yo angular-famous-ionic [app-name]
```

### Typical workflow
A typical workflow would look like this:
```
mkdir test-app && cd test-app
yo angular-famous-ionic
yo angular-famous-ionic:module common
yo angular-famous-ionic:controller common hello
Add some content to client/index.html : <h2 ng-controller="main.common.hello as helloCtrl">{{helloCtrl.message}}</h2>
gulp browsersync
```


## Gulp tasks
Now that the project is created you have a set of simple gulp tasks command available
```
gulp help           # List the main gulp tasks
gulp test           # Run lint, unit tests, and e2e tests
gulp unit           # Run lint and unit tests (karma for client + mocha for server)
gulp karma          # Run karma client unit tests
gulp mocha          # Run mocha server unit tests
gulp e2e            # Run protractor for end to end tests
gulp browserify     # Generate a bundle.js file
gulp style          # Generate a main.css file
gulp browsersync    # Creates a browser-sync server, it will display its url, it watches for js / css / scss / html file changes and inject automatically the change in the browser
```

The gulp tasks share a constant file located at `gulp/common/constants.js`. Feel free to modify it to your project needs.

## Generators

Available generators:

* [angular-famous-ionic](#app) (aka [angular-famous-ionic:app] (#app))
* [angular-famous-ionic:module](#module)
* [angular-famous-ionic:controller](#controller)
* [angular-famous-ionic:directive](#directive)
* [angular-famous-ionic:filter](#filter)
* [angular-famous-ionic:service](#service)
* [angular-famous-ionic:value](#value)
* [angular-famous-ionic:constant](#constant)

**Note: Generators are to be run from the root directory of your app.**

### App
Sets up a new AngularJS app, generating all the boilerplate you need to get started. The appp generator also installs additional AngularJS modules, such as 
* angular-mocks
* angular-animate
* angular-sanitize
* angular-ui-router

The main application is called `main`.

Example:
```
yo angular-famous-ionic
```

### Module
Generates a new module.
The first thing you need to do after executing `yo angular-famous-ionic` is create a module.

Example:
```
yo angular-famous-ionic:module modulename
```

If you don't mention a modulename, yeoman will ask you to provide one.

Produces: 
* `client/scripts/modulename/index.js` 


### Controller
Generates a new controller.

Example:
```
yo angular-famous-ionic:controller modulename controllername
```

You need at least a module in order to scaffold a controller.   

If you don't specify arguments, yeoman will display the list of existing modules and let you choose one.   

Produces: 
* `client/scripts/modulename/controllers/controllername.js`
* `client/scripts/modulename/controllers/controllername.test.js`
* `client/scripts/modulename/controllers/index.js`


### Filter
Generates a new filter.

Example:
```
yo angular-famous-ionic:controller modulename filtername
```

You need at least a module in order to scaffold a filter.   
If you don't specify arguments, yeoman will display the list of existing modules and let you choose one.   

Produces: 
* `client/scripts/modulename/fiters/filtername.js`
* `client/scripts/modulename/fiters/filtername.test.js`
* `client/scripts/modulename/filters/index.js`


### Value
Generates a new value.

Example:
```
yo angular-famous-ionic:value modulename valuename
```

You need at least a module in order to scaffold a value.   
If you don't specify arguments, yeoman will display the list of existing modules and let you choose one.   

Produces: 
* `client/scripts/modulename/values/valuename.js`
* `client/scripts/modulename/values/valuename.test.js`
* `client/scripts/modulename/values/index.js`


### Constant
Generates a new constant.

Example:
```
yo angular-famous-ionic:value modulename constantname
```

You need at least a module in order to scaffold a constant.   
If you don't specify arguments, yeoman will display the list of existing modules and let you choose one.   

Produces: 
* `client/scripts/modulename/constants/constantname.js`
* `client/scripts/modulename/constants/constantname.test.js`
* `client/scripts/modulename/constants/index.js`

### Service
Generates a new service.
You can use the `--servicetype` option to specify if you want a service, a factory, or a provider.
Default `servicetype` is factory.

Example:
```
yo angular-famous-ionic:service modulename servicename
yo angular-famous-ionic:service modulename servicename --servicetype=service
yo angular-famous-ionic:service modulename servicename --servicetype=provider

```

You need at least a module in order to scaffold a service.   
If you don't specify arguments, yeoman will display the list of existing modules and let you choose one.   

Produces: 
* `client/scripts/modulename/services/servicename.js`
* `client/scripts/modulename/services/servicename.test.js`
* `client/scripts/modulename/services/index.js`




## Testing
To run unit test for the yeoman project use the following command:
```
gulp test
```

If you just want to run mocha and are not interested yet in linting your files you can run:
```
gulp mocha
```

If you just want to run some specific unit test use:
```
mocha test/app.test.js -r test/helpers/globals.js
```
This will tell mocha to run only the tests located in `test/app.test.js` (The -r option is necessary here to add global configuration file for mocha, when using gulp the `globals.js` is added automatically)

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/thaiat/generator-angular-famous-ionic/releases)

## License

MIT
