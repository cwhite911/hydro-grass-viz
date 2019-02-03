#!/usr/bin/env bash

##Build for gh-pages
npm run build

##Send dist directory to gh-pages
git stpp dist origin gh-pages