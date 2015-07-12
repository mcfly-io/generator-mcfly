#!/bin/bash
set -e
which bower || npm install -g bower
which istanbul || npm install -g istanbul
which mocha || npm install -g mocha
which karma || npm install -g karma-cli
which gulp || npm install -g gulp
which codeclimate || npm install -g codeclimate-test-reporter
which browserify || npm install -g browserify
which watchify || npm install -g watchify
which webpack || npm install -g webpack

npm install -g cordova
npm install -g ionic

# only if on MacOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    npm install -g ios-sim
    npm install -g ios-deploy
fi

echo "prepublish executed sucessfully"