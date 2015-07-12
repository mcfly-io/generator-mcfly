# generator-mcfly 

[![Join the chat at https://gitter.im/mcfly-io/generator-mcfly](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mcfly-io/generator-mcfly?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM version](https://badge.fury.io/js/generator-mcfly.svg)](http://badge.fury.io/js/generator-mcfly) [![Downloads](http://img.shields.io/npm/dm/generator-mcfly.svg)](http://badge.fury.io/js/generator-mcfly)   
[![Build Status](https://travis-ci.org/mcfly-io/generator-mcfly.svg?branch=master)](https://travis-ci.org/mcfly-io/generator-mcfly) [![Test Coverage](https://codeclimate.com/github/mcfly-io/generator-mcfly/badges/coverage.svg)](https://codeclimate.com/github/mcfly-io/generator-mcfly) [![Code Climate](https://codeclimate.com/github/mcfly-io/generator-mcfly/badges/gpa.svg)](https://codeclimate.com/github/mcfly-io/generator-mcfly)   
[![Dependency Status](https://david-dm.org/mcfly-io/generator-mcfly.svg)](https://david-dm.org/mcfly-io/generator-mcfly) [![devDependency Status](https://david-dm.org/mcfly-io/generator-mcfly/dev-status.svg)](https://david-dm.org/mcfly-io/generator-mcfly#info=devDependencies) [![peerDependency Status](https://david-dm.org/mcfly-io/generator-mcfly/peer-status.svg)](https://david-dm.org/mcfly-io/generator-mcfly#info=peerDependencies)    


> A Yeoman generator for scaffolding an application using angular, browserify, ionic and famous.

[![NPM](https://nodei.co/npm/generator-mcfly.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/generator-mcfly)


# IMPORTANT UPDATE
The generator was previously named `generator-angular-famous-ionic`

2 things to note

1. installation is now `npm install -g generator-mcfly`

2. If you have existing project modify the name of the generator in your `.yo-rc.json` file 

## Description
This generator will scaffold for you an application using angularjs, browserify, and either ionic framwork or famo.us (even both).

The project has the following capabilities:
* Angular best pratices (feature folder structure)
* Sass AND Less enabled
* jshint, jscsc, eslint enabled (so you shouldn't have any typo left in your js files !)
* Webpack or Browserify (you can switch them out)
* Karma configured with Code Coverage
* Browser-sync
* TestFairy publishing

It also supports ES6/7 by using the babel

See it in action here:   
[![Building a native like interface with Famous](http://img.youtube.com/vi/L56RnM6VI-w/0.jpg)](http://www.youtube.com/watch?v=L56RnM6VI-w)

and here:   
[![Building a native like interface with Ionic](http://img.youtube.com/vi/EgRh09CO_rk/0.jpg)](http://www.youtube.com/watch?v=EgRh09CO_rk)


> **NOTE:**   
> This generator is using [generator-sublime](https://github.com/mcfly-io/generator-sublime) to scaffold common dot files (.jshintrc, .eslintrc, etc...).   
> Check it out https://www.npmjs.org/package/generator-sublime

## Prerequisites
In order to get the best experience with this generator, you have to install a couple of globals npm packages.   
To do so you can execute, after the generator has runned, the following command:

```bash
./bin/prepublish.sh
```

This will install, among others, the following packages globally:
* gulp
* browserify
* watchify
* webpack
* cordova
* ionic (cli) - A good cordova wrapper

Feel free to tweak `./bin/prepublish.sh` to add your own requirements.

## Usage

Install `generator-mcfly`:
```
npm install -g generator-mcfly
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo mcfly`, optionally passing an app name:
```
yo mcfly [app-name]
```

### Typical workflow
A typical workflow would look like this:
```
mkdir test-app && cd test-app
yo mcfly
yo mcfly:module common
yo mcfly:controller common hello
Add some content to client/index.html : <h2 ng-controller="main.common.hello as helloCtrl">{{helloCtrl.message}}</h2>
gulp browsersync
```

> **NOTE:**      
> `gulp browsersync` accepts an option --no-browser if you do not want to automatically open a browser


## Upgrade
I like to publish new versions as soon as possible. So here is the upgrade process.

Because `generator-mcfly` has a dependency on `generator-sublime` you should execute the following command:
```
npm update -g generator-mcfly generator-sublime
```

## Client folder
The generator will ask you to provide the name of the folder containing the client source code, and it will save this value in `.yo-rc.json` file (`clientFolder` entry).   
If you rename the client folder, make sure you also modify the value stored in `.yo-rc.json`

## Gulp tasks
Now that the project is created you have a set of simple gulp tasks command available
```
gulp help           # List the main gulp tasks
gulp lint           # Run lint
gulp test           # Run lint, unit tests, and e2e tests
gulp unit           # Run lint and unit tests (karma for client + mocha for server)
gulp karma          # Run karma client unit tests
gulp mocha          # Run mocha server unit tests
gulp e2e            # Run protractor for end to end tests
gulp browserify     # Generate a distribution folder using browserify
gulp webpack:run    # Generate a distribution folder using webpack
gulp style          # Generate a main.css file
gulp browsersync    # Creates a browser-sync server, it will display its url, it watches for js / css / scss / html file changes and inject automatically the change in the browser
gulp dist           # Distribute the application
gulp cordova:image  # Generate the cordova icons and splashs
gulp cordova:run    # Run cordova run (accepts a --platform option)
```

The gulp tasks share a constant file located at `gulp/common/constants.js`. Feel free to modify it to your project needs.   
The constants are resolved against the `--target` option. The default value for `--target` is `app`.

To better understand the gulp task system have a look at the docs of [gulp-mux](https://github.com/mcfly-io/gulp-mux) 

## Browserify/Webpack and namespaces
At the heart of the generator we use `browserify` or `webpack` to bundle together the client javascript files.   
Also because angular modules do not prevent name collision, each scaffolded component gets an unique full name composed like this:
```
[main app name].[module name].[component name]
```

Make sure you use that full name with DI.

**Example:**   
If you need to require a module from another one, use the following code:  

Let's say you have scaffolded 2 modules with the generator, `common` and `analytics`. Since `common` is your base module you first need to connect `analytics` to it with a `require`. Do this in the `module.exports` in `index.js` for `common`, right after the `require` for `angular`. (Make sure you pass the namespace argument to the `require`.) 
```js
var angular = require('angular');
var analytics = require('../analytics')(namespace);
```

Now that you have an `analytics` object that has been passed the `namespace`, you can dependency inject the module using `analytics.name`. Create your app and inject the module.
```js
var app = angular.module(fullname, [..., analytics.name]);
```

Finally your app needs to not only have modules injected but also to  be able to store the names of those modules in an easily accessible location. Attach a `namespace` object to `app` and give it an `analytics` property equal to `analytics.name`.
```js
app.namespace = app.namespace || {};
app.namespace.analytics = analytics.name;
```

You have now a reference between the 2 modules.   
Note that the name of the modules are never hard coded :smile:

We can very easily talk about the `analytics` module from any subcomponent in `app`, but beyond that, we can just as easily get the name of any of component of `analytics`. 

Let's see how. Say that you've created a service on `analytics` called `mixpanelService`. You want to use that service in the `home` controller of the `common`module.

If you scaffolded `mixpanelService` using the generator you won't need to touch anything. If not go into your file and make sure that the name provided to `app.factory` looks like `app.name + '.' + servicename`, which in this case evaluate as 
```js
app.name --> 'main.analytics'
servicename --> 'mixpanel'
```
After being created, the service.name will look like `'main.analytics.mixpanel'`

To inject `mixpanelService` into `common`'s `home` controller, go to `/scripts/common/controllers/home.js` and dependency inject the service name appended to the pointer to `analytics.name` that you made before into your `deps` array:

```js
var deps = [app.namespace.analytics + '.mixpanel'];

function controller(mixpanel) {
...
}
```

Again no hard coded namespace, and only one point of attachment between the modules :smile:


## Generators

Available generators:

* [mcfly](#app) (aka [mcfly:app] (#app))
* [mcfly:target](#target)
* [mcfly:module](#module)
* [mcfly:controller](#controller)
* [mcfly:directive](#directive)
* [mcfly:filter](#filter)
* [mcfly:service](#service)
* [mcfly:value](#value)
* [mcfly:constant](#constant)
* [mcfly:require](#require)


**Note: Generators are to be run from the root directory of your app.**

### App
Sets up a new AngularJS app, generating all the boilerplate you need to get started. The app generator also installs additional AngularJS modules, such as 
* angular-mocks
* angular-animate
* angular-sanitize
* angular-ui-router

The main application is called `main`.


Example:
```
yo mcfly
```

You can choose to scaffold a mobile (cordova) app using the option --mobile
Example:
```
yo mcfly --mobile
```
This will scaffold a config.xml file (suffixed with the app name), and hooks expected by cordova.    
In addition the `dist` folder will conform to cordova expectation (`www` sub folder).

### Target
Generate a new target application.   
This is usefull if you want to share code between several applications (mobile, web, etc...).

Example:
```
yo mcfly:target web
```

Produces: 
* `client/index-web.html`
* `client/scripts/main-web.js`
* `client/styles/main-web.scss`

> **NOTE:**    
> By default the app generate a default application with no suffix. This is equivalent to running the `target` generator with argument `app`

You can choose to scaffold a mobile (cordova) app using the option --mobile
Example:
```
yo mcfly:target mymobileapp --mobile
```
This will scaffold a config.xml file (suffixed with the app name), and hooks expected by cordova.    
In addition the `dist` folder will conform to cordova expectation (`www` sub folder).


### Module
Generates a new module.
The first thing you need to do after executing `yo mcfly` is create a module.

Example:
```
yo mcfly:module modulename
```

If you don't mention a modulename, yeoman will ask you to provide one.

Produces: 
* `client/scripts/modulename/index.js` 
* `client/scripts/modulename/view/home.html`


If you do not want any route for the module, you can use the option `--skip-route`   
Example:
```
yo mcfly:module modulename --skip-route
```

In this case this will only produce:
* `client/scripts/modulename/index.js`

### Controller
Generates a new controller.

Example:
```
yo mcfly:controller modulename controllername
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
yo mcfly:controller modulename filtername
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
yo mcfly:value modulename valuename
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
yo mcfly:value modulename constantname
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
yo mcfly:service modulename servicename
yo mcfly:service modulename servicename --servicetype=service
yo mcfly:service modulename servicename --servicetype=provider
```

You need at least a module in order to scaffold a service.   
If you don't specify arguments, yeoman will display the list of existing modules and let you choose one.   

Produces: 
* `client/scripts/modulename/services/servicename.js`
* `client/scripts/modulename/services/servicename.test.js`
* `client/scripts/modulename/services/index.js`

### Directive
Generates a new directive.
You can use the `--compile` option to specify if you want compile, pre and post link function (true), or just a simple link function (false).
Default `compile` is true.

Example:
```
yo mcfly:directive modulename myDirective
yo mcfly:directive modulename myDirective --compile=false
```

You need at least a module in order to scaffold a directive.   
If you don't specify arguments, yeoman will display the list of existing modules and let you choose one.   

Produces: 
* `client/scripts/modulename/directives/myDirective.html`
* `client/scripts/modulename/directives/myDirective.js`
* `client/scripts/modulename/directives/myDirective.test.js`
* `client/scripts/modulename/directives/index.js`


### Require
This generator will not scaffold any files.   
Instead it inspects the existing `client` folder and will refresh the needed injected require statements in every file where it is relevant.   

Example:
```
yo mcfly:require
```

## Adding a third party bower package
You should always prefer an npm package instead of a bower package. Most of client side libraries nowadays exist as both npm and bower packages.
But sometimes it is not the case and you have to deal with a bower package.

If you want to include a third party bower package do the following:

* `bower install --save yourpackage`
* modify `package.json` `browser` section to include a path to the global minified javascript file of the package
* adjust the **font** gulp constants (`gulp/common/constants.js`) to include the relevant fonts of the package (if applicable)
* if the package exposes a global `.scss` file import it into `client/styles/main.scss` and ajdust eventually the variable for the path font (should be `../fonts`)
* if the package only exposes a `.css` file adjust the **css** file constants (`gulp/common/constants.js`) to include it
* if the package relies on other libraries
  * Either add a browser-shim section (but this will only work with browserify, not webpack)
  * Or make sure you require the dependencies in your code just before you require the package.
## Cordova applications
When you scaffold a mobile app (`yo mcfly:target myapp --mobile`), this will create a `cordova/myapp` folder under `client`.

This folder contains hooks and resources (icons and spashs) that will be copied over during the `dist` gulp task.

If you want to generate icons and splashes from a single icon file you can execute
```
gulp cordova:icon
```
It expects an `icon.png` file located in './client/icons/myapp` folder.

The plugins you need for your mobile app must be added in the `./client/cordova/myapp/hooks/010_install_plugins.js' file.   
The hook is responsible for installing them on relevant platforms.

You first need to execute `gulp dist --t myapp` (with additional `--mode` option i.e `dev` or `prod`), in order to build the dist folder.

Then you need to build the mobile platforms.   
To do so run:
```bash
cd dist/maypp/<dev or prod>/
cordova platform add <ios or android or ...>
```

When you run `gulp browsersync --t myapp` the task will detect that `myapp` is a mobile app, and will automatically launch both a browser-sync browser window and a livereload emulator.   
You can pass an addition `--platform` option to tell it which emulator you want (ios, android, etc...).   
If you don't pass `--platform` it will choose the value from `constants.js` (`constants.cordova.platform`).

When you are done with testing the app in the browser or the emulator, you can attach your phone device via an USB cable and run: 
```bash
gulp cordova:run
```

If you want to upload your app to testfairy, first make sure you fill in your api_key for testfairy in `gulp_tasks/common/constants.js`,    
and then simply run
```bash
gulp cordova:testfairy
```

## Testing
To run unit test for the yeoman project use the following command:
```
gulp test
```

If you just want to run karma and are not interested yet in linting your files you can run:
```
gulp karma
```

If you wish to debug the code please use the --debug flag
```
gulp karma --debug
```

You can eventually also run karma in the background, with auto refresh using the option `--start`
```
gulp karma --start
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

Recent changes can be viewed on Github on the [Releases Page](https://github.com/mcfly-io/generator-mcfly/releases)

## License

BSD
