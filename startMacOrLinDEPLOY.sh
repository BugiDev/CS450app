#!/bin/sh

cd public
grunt deploy
cd ..
nodemon server.js deploy
