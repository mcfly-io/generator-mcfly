Contribution Guide
===================

This document describes some points about contribution process for this project.
The project is being developed within community. Maintainer merges pull-requests, fixes critical bugs.

The maintainers of the project are:
- [Avi Haiat](http://github.com/thaiat)

## General notes

- In lieu of a formal styleguide, take care to maintain the existing coding style 
- Add unit tests for any new or changed functionality.
- Lint and test your code using [gulp lint](http://gulpjs.com/).

## Test your changes to the generator's functionality

Inside your local clones' folders, finish off your changes and then run

```sh
npm link
```

Make sure you do an `npm link` there ***before*** running the command in your `generator-mcfly` folder, if you are testing both.

This replaces your global versions of `generator-mcfly` and/or `generator-sublime` with symbolic links to your local clones of the generators.

Once this is done, create a folder for a new project somewhere on your system, e.g. `~/my-mcfly-projects/test-mcfly`, and `cd` into it. Inside run mcfly with
```sh
yo mcfly
```
and have the generator run. 

>If errors occur during the npm install in your new project, mark down which dependencies need to be upgraded or changed. A `.gulps-package.json` file will be created. Copy the `devDependencies` object from this file, paste it in your project's `package.json` file, change the versions or dependencies as needed, and then run `npm install`.

Next scaffold a module with a controller
```sh
yo mcfly:module common
yo mcfly:controller common home
```

Then run lint & karma, everything should pass. 
```sh
gulp lint
gulp karma
```

Make sure you also test the functionality you added to make sure it does what you intended. Please put this project in a public repo and link to it in your PR so we can check out the results.

Finally don't forget to unlink and re-install the generators from npm by running
```sh
npm uninstall -g generator-sublime generator-mcfly
npm install -g generator-sublime generator-mcfly
```

And please:

### Always run `npm test` before sending a PR
> This will also run `gulp lint`

## Sending Pull-Requests

If you fixed or added something useful to the project, you can send pull-request. It will be reviewed by maintainer and accepted, or commented for rework, or declined. If you a new and don't know what you should do to send a PR, please see [this tutorial](https://gist.github.com/luanmuniz/da0b8d2152c4877f93c4)

Before sending you Pull Request please don't forget to check your code with `npm test`. PR that don't pass tests will not be accept