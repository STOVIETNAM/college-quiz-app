#!/bin/sh
rm -rf vendor
rm app.tar.gz
composer install --optimize-autoloader --no-dev
php artisan config:clear
php artisan route:clear
php artisan cache:clear
rm storage/logs/laravel.log
tar --exclude=client --exclude=dump --exclude=node_modules --exclude=img --exclude=.git --exclude=composer.lock --exclude='app.tar.gz' -czvf app.tar.gz *