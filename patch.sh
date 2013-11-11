#/bin/sh
cp -R ../ocStore-1.5.5.1.1/upload/* .
cp -R ../vqmod .
cp -R ../faq151/upload/* .
touch config.php admin/config.php
chmod a+w system/cache/ system/logs/ image/ image/cache/ image/data/ download vqmod/vqcache
echo 'drop database opencart;create database opencart;' | mysql -uroot -ptest
svn export https://yogamamadvd.googlecode.com/svn/trunk
cp -R trunk/* .
rm -rf trunk
echo "Go to the app, configure it, then to admin Extensions - Modules, install FAQs and click Edit to create it's tables, then press Enter to finish the installation"
read DUMMY
mysql -uroot -ptest opencart < yogamamadvd.sql
rm -rf install
