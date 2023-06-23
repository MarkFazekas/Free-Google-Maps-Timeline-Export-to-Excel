#!/bin/bash

variable=$1
sed -i '4s/.*/  "version": "'"$variable"'",/'  src/chrome/manifest.json
sed -i '4s/.*/  "version": "'"$variable"'",/'  src/firefox/manifest.json
