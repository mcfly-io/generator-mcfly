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

bower install

echo "prepublish executed sucessfully"