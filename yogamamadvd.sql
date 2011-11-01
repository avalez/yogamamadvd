/*!40101 SET NAMES utf8 */;

ALTER TABLE address add `country` varchar(128) COLLATE utf8_bin NOT NULL;
ALTER TABLE address add `zone` varchar(128) COLLATE utf8_bin NOT NULL;

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (24377,'0', 'free', 'free_total', 0, 0);
INSERT INTO `setting` VALUES (24378,'0', 'free', 'free_geo_zone_id', 0, 0);
INSERT INTO `setting` VALUES (24379,'0', 'free', 'free_status', 1, 0);
INSERT INTO `setting` VALUES (24380,'0', 'free', 'free_sort_order', 1, 0);
UPDATE `setting` SET `value` = 'data/favicon.png' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_icon';
-- UPDATE `setting` SET `value` = 'data/logo.png' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_log';
UPDATE `setting` SET `value` = 'RUR' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_currency';
UPDATE `setting` SET `value` = 'ru' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_language';
UPDATE `setting` SET `value` = 2761 WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_zone_id';
UPDATE `setting` SET `value` = 176 WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_country_id';
UPDATE `setting` SET `value` = 'yogamamadvd' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_template';
UPDATE `setting` SET `value` = 'Yoga Mama DVD' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_meta_description';
UPDATE `setting` SET `value` = 'Йога для будущих мам' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_title';
UPDATE `setting` SET `value` = '+420 774 312 721' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_telephone';
UPDATE `setting` SET `value` = 'azhdanov@gmail.com' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_email';
UPDATE `setting` SET `value` = 'Rizska 1492/2' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_address';
UPDATE `setting` SET `value` = 'Life Yoga Club' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_owner';
UPDATE `setting` SET `value` = 'Йога для будущих мам' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_name';
UPDATE `setting` SET `value` = 'a:1:{i:0;a:7:{s:9:"banner_id";s:1:"9";s:5:"width";s:3:"850";s:6:"height";s:3:"409";s:9:"layout_id";s:1:"1";s:8:"position";s:11:"content_top";s:6:"status";s:1:"1";s:10:"sort_order";s:1:"1";}}' WHERE `store_id` = 0 AND `group` = 'slideshow' AND `key` = 'slideshow_module';
DELETE `setting` WHERE `store_id` = 0 AND `group` = 'featured' AND `key` = 'featured_module';
DELETE `setting` WHERE `store_id` = 0 AND `group` = 'account' AND `key` = 'account_module';
DELETE `setting` WHERE `store_id` = 0 AND `group` = 'affiliate' AND `key` = 'affiliate_module';
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `extension` WRITE;
/*!40000 ALTER TABLE `extension` DISABLE KEYS */;
INSERT INTO `extension` VALUES (428,'payment', 'liqpay');
INSERT INTO `extension` VALUES (429,'shipping', 'free');
/*!40000 ALTER TABLE `extension` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `currency` WRITE;
/*!40000 ALTER TABLE `currency` DISABLE KEYS */;
INSERT INTO `currency` VALUES (4,'Русский рубль','RUR','','руб.','0',1.00000000,1,'2011-10-12 00:57:26');
/*!40000 ALTER TABLE `currency` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` VALUES (2,'Russian','ru','ru_RU.UTF-8','ru.png','russian','russian',1,1);
UPDATE `language` SET `sort_order` = 2 WHERE `language_id` = 1;
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `banner` WRITE;
/*!40000 ALTER TABLE `banner` DISABLE KEYS */;
INSERT INTO `banner` VALUES (9,'commingsoon',1);
/*!40000 ALTER TABLE `banner` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `banner_image` WRITE;
/*!40000 ALTER TABLE `banner_image` DISABLE KEYS */;
INSERT INTO `banner_image` VALUES (78,9,'','data/banner.png');
/*!40000 ALTER TABLE `banner_image` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `banner_image_description` WRITE;
/*!40000 ALTER TABLE `banner_image_description` DISABLE KEYS */;
INSERT INTO `banner_image_description` VALUES (78,2,9,'Счастливая йога для беременных - скоро в продаже!'),(78,1,9,'Yoga Mama DVD Coming soon!');
/*!40000 ALTER TABLE `banner_image_description` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (59,'',0,0,1,0,1,'2011-10-20 17:58:03','2011-10-20 17:58:03');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `category_description` WRITE;
/*!40000 ALTER TABLE `category_description` DISABLE KEYS */;
INSERT INTO `category_description` VALUES (59,2,'Yoga','','','');
/*!40000 ALTER TABLE `category_description` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `category_to_store` WRITE;
/*!40000 ALTER TABLE `category_to_store` DISABLE KEYS */;
INSERT INTO `category_to_store` VALUES (59,0);
/*!40000 ALTER TABLE `category_to_store` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES(50,'DVD1','','','',100,5,'data/yoga1.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,1,1,'2011-10-21 11:04:45','2011-10-21 11:29:32',0);
INSERT INTO `product` VALUES(51,'DVD2','','','',100,5,'data/yoga2.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,1,1,'2011-10-21 11:04:45','2011-10-21 11:29:32',0);
INSERT INTO `product` VALUES(52,'DVD3','','','',100,5,'data/yoga3.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,1,1,'2011-10-21 11:04:45','2011-10-21 11:29:32',0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product_description` WRITE;
/*!40000 ALTER TABLE `product_description` DISABLE KEYS */;
INSERT INTO `product_description` VALUES (50,1,'Йога для будущих мам 1 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в первом триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','');
INSERT INTO `product_description` VALUES (50,2,'Йога для будущих мам 1 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в первом триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','');
INSERT INTO `product_description` VALUES (51,1,'Йога для будущих мам 2 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем во втором триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','');
INSERT INTO `product_description` VALUES (51,2,'Йога для будущих мам 2 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем во втором триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','');
INSERT INTO `product_description` VALUES (52,1,'Йога для будущих мам 3 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в третьем триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','');
INSERT INTO `product_description` VALUES (52,2,'Йога для будущих мам 3 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в третьем триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','');
/*!40000 ALTER TABLE `product_description` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product_to_category` WRITE;
/*!40000 ALTER TABLE `product_to_category` DISABLE KEYS */;
INSERT INTO `product_to_category` VALUES (50,59);
INSERT INTO `product_to_category` VALUES (51,59);
INSERT INTO `product_to_category` VALUES (52,59);
/*!40000 ALTER TABLE `product_to_category` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product_to_download` WRITE;
/*!40000 ALTER TABLE `product_to_download` DISABLE KEYS */;
INSERT INTO `product_to_download` VALUES (50,1);
INSERT INTO `product_to_download` VALUES (51,2);
INSERT INTO `product_to_download` VALUES (52,3);
/*!40000 ALTER TABLE `product_to_download` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product_to_store` WRITE;
/*!40000 ALTER TABLE `product_to_store` DISABLE KEYS */;
INSERT INTO `product_to_store` VALUES (50,0);
INSERT INTO `product_to_store` VALUES (51,0);
INSERT INTO `product_to_store` VALUES (52,0);
/*!40000 ALTER TABLE `product_to_store` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `download` WRITE;
/*!40000 ALTER TABLE `download` DISABLE KEYS */;
INSERT INTO `download` VALUES (1,'DVD1.AVI','DVD1.AVI',5,'2011-10-21 11:04:45');
INSERT INTO `download` VALUES (2,'DVD2.AVI','DVD2.AVI',5,'2011-10-21 11:04:45');
INSERT INTO `download` VALUES (3,'DVD3.AVI','DVD3.AVI',5,'2011-10-21 11:04:45');
/*!40000 ALTER TABLE `download` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `download_description` WRITE;
/*!40000 ALTER TABLE `download_description` DISABLE KEYS */;
INSERT INTO `download_description` VALUES (1,1,'DVD1.AVI');
INSERT INTO `download_description` VALUES (2,1,'DVD2.AVI',);
INSERT INTO `download_description` VALUES (2,2,'DVD2.AVI');
INSERT INTO `download_description` VALUES (3,1,'DVD3.AVI');
INSERT INTO `download_description` VALUES (3,2,'DVD3.AVI');
/*!40000 ALTER TABLE `download_description` ENABLE KEYS */;
UNLOCK TABLES;
