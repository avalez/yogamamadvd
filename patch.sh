#/bin/sh
cp -R ../opencart_v1.5.1.1/upload/* .
cp -R ../faq151/upload/* .
chmod a+w config.php admin/config.php system/cache/ system/logs/ image/ image/cache/ image/data/ download
echo 'drop database opencart;create database opencart;' | mysql -uroot -ptest
cp -R ../trunk/* .
cp -R ../trunk/.svn .
cp ../yogamamadvd.sql .
echo "Go to the app, configure it, then to admin Extensions - Modules, install FAQs and click Edit to create it's tables, then press Enter to finish the installation"
read DUMMY
mysql -uroot -ptest opencart < yogamamadvd.sql
rm -rf install
