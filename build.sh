#!/bin/sh
rm -rf ./public/index.html
rm -rf ./public/assets
rm -rf ./public/langs
cd client
npm run build
cp -r ./dist/* ../public
cd ..
cp -r ./public/index.html ./resources/views/index.blade.php