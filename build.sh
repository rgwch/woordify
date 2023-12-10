#! /bin/bash

git stash
git pull
cd client
npm run build
cd ../server
npm run build
cd ..
