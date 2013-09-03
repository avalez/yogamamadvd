#/bin/sh
cp -R ../ocStore-1.5.4.1.2/upload/* .
cp -R ../vqmod .
cp -R ../faq151/upload/* .
chmod a+w config.php admin/config.php system/cache/ system/logs/ image/ image/cache/ image/data/ download vqmod/vqcache
echo 'drop database opencart;create database opencart;' | mysql -uroot -ptest
cp -R ../trunk/* .
find . -name .svn | xargs rm -rf
echo "Go to the app, configure it, then to admin Extensions - Modules, install FAQs and click Edit to create it's tables, then press Enter to finish the installation"
read DUMMY
mysql -uroot -ptest opencart < yogamamadvd.sql
rm -rf install
