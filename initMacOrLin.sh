#!/bin/sh

npm install
npm install -- global bower
npm install grunt -- global
npm install grunt-cli -- global
npm install jshint -- global
npm install requirejs -- global
npm install -- global nodemon
#node initDB/testDBData
node initDB/initDBData
cd public
npm install
bower install
echo "Initialization successfully finished"