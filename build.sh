#!/bin/bash

npm run build;
mv build/index.html build/viewer.html;
cp src/config.html build/config.html;
rm app.zip;
zip app.zip build/*;