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


> **NOTE:**   
> This generator is using generator-sublime to scaffold common dot files (.jshintrc, .eslintrc, etc...).   
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
* cordova
* ionic (cli) - A good cordova wrapper

Feel free to twick `./bin/prepublish.sh` to add your own requirements.

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

## Upgrade
I like to publish new versions as soon as possible. So here is the upgrade process.

Because `generator-angular-famous-ionic` has a dependency on `generator-sublime` you should execute the following command:
```
npm update -g generator-angular-famous-ionic generator-sublime
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
gulp browserify     # Generate dist file and launc a browser-sync browser and live reload emulator if the target app is mobile
gulp style          # Generate a main.css file
gulp browsersync    # Creates a browser-sync server, it will display its url, it watches for js / css / scss / html file changes and inject automatically the change in the browser
gulp dist           # Distribute the application
gulp cordova:image  # Generate the cordova icons and splashs
gulp cordova:run    # Run cordova run (accepts a --platform option)
```

The gulp tasks share a constant file located at `gulp/common/constants.js`. Feel free to modify it to your project needs.   
The constants are resolved against the `--target` option. The default value for `--target` is `app`.

To better understand the gulp task system have a look at the docs of [gulp-mux](https://github.com/thaiat/gulp-mux) 

## Browserify and namespaces
At the heart of the generator we use `browserify` to bundle together the client javascript files.   
Also because angular modules do not prevent name collision, each scaffolded component gets an unique full name composed like this:
```
[main app name].[module name].[component name]
```

Make sure you use that full name with DI.

**Example:**   
If you need to require a module from another one, use the following code:  

Let's say you have scaffolded 2 modules with the generator, `common` and `analytics`. Since `common` is your base module you first need to connect `analytics` to it with a `require`. Do this in the `module.exports` in `index.js` for `common`, right after the `require` for `angular`. (Make sure you pass the namespace the namespace argument to the `require`.) 
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

* [angular-famous-ionic](#app) (aka [angular-famous-ionic:app] (#app))
* [angular-famous-ionic:target](#target)
* [angular-famous-ionic:module](#module)
* [angular-famous-ionic:controller](#controller)
* [angular-famous-ionic:directive](#directive)
* [angular-famous-ionic:filter](#filter)
* [angular-famous-ionic:service](#service)
* [angular-famous-ionic:value](#value)
* [angular-famous-ionic:constant](#constant)
* [angular-famous-ionic:require](#require)


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
yo angular-famous-ionic
```

You can choose to scaffold a mobile (cordova) app using the option --mobile
Example:
```
yo angular-famous-ionic --mobile
```
This will scaffold a config.xml file (suffixed with the app name), and hooks expected by cordova.    
In addition the `dist` folder will conform to cordova expectation (`www` sub folder).

### Target
Generate a new target application.   
This is usefull if you want to share code between several applications (mobile, web, etc...).

Example:
```
yo angular-famous-ionic:target web
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
yo angular-famous-ionic:target mymobileapp --mobile
```
This will scaffold a config.xml file (suffixed with the app name), and hooks expected by cordova.    
In addition the `dist` folder will conform to cordova expectation (`www` sub folder).


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
* `client/scripts/modulename/view/home.html`


If you do not want any route for the module, you can use the option `--skip-route`   
Example:
```
yo angular-famous-ionic:module modulename --skip-route
```

In this case this will only produce:
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

### Directive
Generates a new directive.
You can use the `--compile` option to specify if you want compile, pre and post link function.
Default `compile` is false.

Example:
```
yo angular-famous-ionic:directive modulename myDirective
yo angular-famous-ionic:directive modulename myDirective --compile
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
yo angular-famous-ionic:require
```

## Adding a third party bower package
If you want to include a third party bower package do the following:

* `bower install --save yourpackage`
* modify `package.json` bower section to include a path to the global minified javascript file of the package
* adjust the **font** gulp constants (`gulp/common/constants.js`) to include the relevant fonts of the package (if applicable)
* if the package exposes a global `.scss` file import it into `client/styles/main.scss` and ajdust eventually the variable for the path font (should be `../fonts`)
* if the package only exposes a `.css` file adjust the **css** file constants (`gulp/common/constants.js`) to include it

## Cordova applications
When you scaffold a mobile app (`yo angular-famous-ionic:target myapp --mobile`), this will create a `cordova/myapp` folder under `client`.

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

## Testing
To run unit test for the yeoman project use the following command:
```
gulp test
```

If you just want to run karma and are not interested yet in linting your files you can run:
```
gulp karma
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

BSD
