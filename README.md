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

Run `gulp browsersync` for creating a browser-sync server.


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


## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/thaiat/generator-angular-famous-ionic/releases)

## License

MIT
