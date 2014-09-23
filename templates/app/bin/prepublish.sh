#!/bin/bash
set -e
bash which bower || npm install -g bower
bash which istanbul || npm install -g istanbul
bash which mocha || npm install -g mocha
bash which karma || npm install -g karma-cli
bash which gulp || npm install -g gulp
bash which codeclimate || npm install -g codeclimate-test-reporter
bash which browserify || npm install -g browserify
bash which watchify || npm install -g watchify
echo "prepublish executed sucessfully"