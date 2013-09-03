/*!40101 SET NAMES utf8 */;

-- FIXME: language!!!

ALTER TABLE `address` ADD `country` VARCHAR(128) COLLATE utf8_bin NOT NULL;
ALTER TABLE `address` ADD `zone` VARCHAR(128) COLLATE utf8_bin NOT NULL;
ALTER TABLE `faq_description` MODIFY `title` VARCHAR(256) COLLATE utf8_bin NOT NULL DEFAULT '';

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (24377,'0', 'free', 'free_total', 0, 0);
INSERT INTO `setting` VALUES (24378,'0', 'free', 'free_geo_zone_id', 0, 0);
INSERT INTO `setting` VALUES (24379,'0', 'free', 'free_status', 1, 0);
INSERT INTO `setting` VALUES (24380,'0', 'free', 'free_sort_order', 1, 0);
INSERT INTO `setting` VALUES (24381,'0', 'config', 'awsBucket', 'yogamamadvd', 0);
INSERT INTO `setting` VALUES (24382,'0', 'config', 'awsAccessKey', 'awsAccessKey', 0);
INSERT INTO `setting` VALUES (24383,'0', 'config', 'awsSecretKey', 'awsSecretKey', 0);
UPDATE `setting` SET `value` = 'data/favicon.png' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_icon';
-- UPDATE `setting` SET `value` = 'data/logo.png' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_log';
-- UPDATE `setting` SET `value` = 'RUR' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_currency';
-- UPDATE `setting` SET `value` = 'ru' WHERE `store_id` = 0 AND `group` = 'config' AND `key` = 'config_language';
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
UPDATE `setting` SET `value` = 'a:1:{i:0;a:7:{s:9:"banner_id";s:1:"9";s:5:"width";s:3:"873";s:6:"height";s:3:"421";s:9:"layout_id";s:1:"1";s:8:"position";s:11:"content_top";s:6:"status";s:1:"1";s:10:"sort_order";s:1:"1";}}' WHERE `store_id` = 0 AND `group` = 'slideshow' AND `key` = 'slideshow_module';
DELETE FROM `setting` WHERE `store_id` = 0 AND `group` = 'featured' AND `key` = 'featured_module';
DELETE FROM `setting` WHERE `store_id` = 0 AND `group` = 'carousel' AND `key` = 'carousel_module';
DELETE FROM `setting` WHERE `store_id` = 0 AND `group` = 'account' AND `key` = 'account_module';
DELETE FROM `setting` WHERE `store_id` = 0 AND `group` = 'affiliate' AND `key` = 'affiliate_module';
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `extension` WRITE;
/*!40000 ALTER TABLE `extension` DISABLE KEYS */;
-- INSERT INTO `extension` VALUES (428,'module', 'faq');
INSERT INTO `extension` VALUES (429,'payment', 'liqpay');
INSERT INTO `extension` VALUES (430,'shipping', 'free');
DELETE FROM `extension` WHERE `type` = 'module' AND `code` = 'featured';
DELETE FROM `extension` WHERE `type` = 'module' AND `code` = 'carousel';
DELETE FROM `extension` WHERE `type` = 'module' AND `code` = 'account';
DELETE FROM `extension` WHERE `type` = 'module' AND `code` = 'affiliate';
/*!40000 ALTER TABLE `extension` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `currency` WRITE;
/*!40000 ALTER TABLE `currency` DISABLE KEYS */;
INSERT INTO `currency` VALUES (4,'Русский рубль','RUR','','руб.','0',1.00000000,1,'2011-10-12 00:57:26');
/*!40000 ALTER TABLE `currency` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
/*INSERT INTO `language` VALUES (2,'Russian','ru','ru_RU.UTF-8','ru.png','russian','russian',1,1);*/
/*UPDATE `language` SET `sort_order` = 2 WHERE `language_id` = 1;*/
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `order_status` WRITE;
/*!40000 ALTER TABLE `order_status` DISABLE KEYS */;
/*INSERT INTO `order_status` VALUES (2,2,'Processing'),(3,2,'Shipped'),(7,2,'Canceled'),(5,2,'Complete'),(8,2,'Denied'),
(9,2,'Canceled Reversal'),(10,2,'Failed'),(11,2,'Refunded'),(12,2,'Reversed'),(13,2,'Chargeback'),(1,2,'Pending'),(16,2,'Voided'),
(15,2,'Processed'),(14,2,'Expired');*/
/*!40000 ALTER TABLE `order_status` ENABLE KEYS */;
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
INSERT INTO `category_description` VALUES (59,1,'Yoga','','','','','');
INSERT INTO `category_description` VALUES (59,2,'Yoga','','','','','');
/*!40000 ALTER TABLE `category_description` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `category_to_store` WRITE;
/*!40000 ALTER TABLE `category_to_store` DISABLE KEYS */;
INSERT INTO `category_to_store` VALUES (59,0);
/*!40000 ALTER TABLE `category_to_store` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES(50,'DVD1','','','','','','','',100,5,'data/yoga1.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,1,1,'2011-10-21 11:04:45','2011-10-21 11:29:32',0);
INSERT INTO `product` VALUES(51,'DVD2','','','','','','','',100,5,'data/yoga2.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,1,1,'2011-10-21 11:04:45','2011-10-21 11:29:32',0);
INSERT INTO `product` VALUES(52,'DVD3','','','','','','','',100,5,'data/yoga3.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,1,1,'2011-10-21 11:04:45','2011-10-21 11:29:32',0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product_description` WRITE;
/*!40000 ALTER TABLE `product_description` DISABLE KEYS */;
INSERT INTO `product_description` VALUES (50,1,'Йога для будущих мам 1 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в первом триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','','','','');
INSERT INTO `product_description` VALUES (50,2,'Йога для будущих мам 1 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в первом триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','','','','');
INSERT INTO `product_description` VALUES (51,1,'Йога для будущих мам 2 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем во втором триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','','','','');
INSERT INTO `product_description` VALUES (51,2,'Йога для будущих мам 2 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем во втором триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','','','','');
INSERT INTO `product_description` VALUES (52,1,'Йога для будущих мам 3 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в третьем триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','','','','');
INSERT INTO `product_description` VALUES (52,2,'Йога для будущих мам 3 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в третьем триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','','','','','');
/*!40000 ALTER TABLE `product_description` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product_to_category` WRITE;
/*!40000 ALTER TABLE `product_to_category` DISABLE KEYS */;
INSERT INTO `product_to_category` VALUES (50,59,false);
INSERT INTO `product_to_category` VALUES (51,59,false);
INSERT INTO `product_to_category` VALUES (52,59,false);
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
INSERT INTO `download_description` VALUES (1,2,'DVD1.AVI');
INSERT INTO `download_description` VALUES (2,1,'DVD2.AVI');
INSERT INTO `download_description` VALUES (2,2,'DVD2.AVI');
INSERT INTO `download_description` VALUES (3,1,'DVD3.AVI');
INSERT INTO `download_description` VALUES (3,2,'DVD3.AVI');
/*!40000 ALTER TABLE `download_description` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,0,1,0),(2,0,1,0),(3,0,1,0);
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `faq_to_store` WRITE;
/*!40000 ALTER TABLE `faq_to_store` DISABLE KEYS */;
INSERT INTO `faq_to_store` VALUES (1,0),(2,0),(3,0);
/*!40000 ALTER TABLE `faq_to_store` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `faq_description` WRITE;
/*!40000 ALTER TABLE `faq_description` DISABLE KEYS */;
INSERT INTO `faq_description` VALUES (1,2,'Как скоро я получу диск, если я закажу курс сегодня?','','&lt;p&gt;\r\n	Если Вы выберите доставку почтой, то тогда это зависит от Вашего местоположения.Мы находимся в России в г. Москва и все заказы кроме Европы, шлем отсюда.&lt;/p&gt;\r\n&lt;p&gt;\r\n	По опыту можно сказать, что до крупных городов посылка идет 4-10 дней, до средних и маленьких 10-15 дней.&amp;nbsp;Если Вы заказываете из Европы, то для Вас сроки будет 5-7 рабочих дней, т.к. эти заказы высылаются из чешской столицы -Праги.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Если Вы выберете способ доставки &quot;закачка по Интернет&quot;, тогда письмо со ссылками на закачку будет отправлено на ваш e-mail сразу же, как только поступит оплата.&lt;/p&gt;\r\n'),
(1,1,'Как скоро я получу диск, если я закажу курс сегодня?','','&lt;p&gt;\r\n	Если Вы выберите доставку почтой, то тогда это зависит от Вашего местоположения.Мы находимся в России в г. Москва и все заказы кроме Европы, шлем отсюда.&lt;/p&gt;\r\n&lt;p&gt;\r\n	По опыту можно сказать, что до крупных городов посылка идет 4-10 дней, до средних и маленьких 10-15 дней.&amp;nbsp;Если Вы заказываете из Европы, то для Вас сроки будет 5-7 рабочих дней, т.к. эти заказы высылаются из чешской столицы -Праги.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Если Вы выберете способ доставки &quot;закачка по Интернет&quot;, тогда письмо со ссылками на закачку будет отправлено на ваш e-mail сразу же, как только поступит оплата.&lt;/p&gt;\r\n'),
(2,2,'Как можно оплатить курс?','','&lt;p style=&quot;margin-left:8.6pt;&quot;&gt;\r\n	Проще всего оплатить курс на почте, когда он к Вам придет.&lt;br /&gt;\r\n	Для этого Вам нужно выбрать способ оплаты &quot;Наложенный платеж&quot; и следовать по шагам. Но у этого способа есть недостаток - почта за свои услуги возьмет с Вас 8% от стоимости заказа, поэтому есть еще варианты заказать курс по предоплате.&lt;/p&gt;\r\n&lt;p style=&quot;margin-left:8.6pt;&quot;&gt;\r\n	Все представленные на сайте способы оплаты, кроме наложенного платежа, являются 100% предоплатой.&lt;/p&gt;\r\n&lt;p style=&quot;margin-left:8.6pt;&quot;&gt;\r\n	В этом случае Вы платите, стоимость указанную в корзине на этом сайте, а с почты забираете диск бесплатно&lt;/p&gt;\r\n&lt;p style=&quot;margin-left:8.6pt;&quot;&gt;\r\n	Если Вы хотите скачать курс, то выбирайте один из способов предоплаты, а в корзине способ доставки &quot;закачка по Интернет&quot;. При этом Вы сэкономите, так как не придется платить за доставку, заказ для Вас будет состоять только из стоимости диска(ов).&lt;/p&gt;\r\n'),
(2,1,'Как можно оплатить курс?','','&lt;p style=&quot;margin-left:8.6pt;&quot;&gt;\r\n	Проще всего оплатить курс на почте, когда он к Вам придет.&lt;br /&gt;\r\n	Для этого Вам нужно выбрать способ оплаты &quot;Наложенный платеж&quot; и следовать по шагам. Но у этого способа есть недостаток - почта за свои услуги возьмет с Вас 8% от стоимости заказа, поэтому есть еще варианты заказать курс по предоплате.&lt;/p&gt;\r\n&lt;p style=&quot;margin-left:8.6pt;&quot;&gt;\r\n	Все представленные на сайте способы оплаты, кроме наложенного платежа, являются 100% предоплатой.&lt;/p&gt;\r\n&lt;p style=&quot;margin-left:8.6pt;&quot;&gt;\r\n	В этом случае Вы платите, стоимость указанную в корзине на этом сайте, а с почты забираете диск бесплатно&lt;/p&gt;\r\n&lt;p style=&quot;margin-left:8.6pt;&quot;&gt;\r\n	Если Вы хотите скачать курс, то выбирайте один из способов предоплаты, а в корзине способ доставки &quot;закачка по Интернет&quot;. При этом Вы сэкономите, так как не придется платить за доставку, заказ для Вас будет состоять только из стоимости диска(ов).&lt;/p&gt;\r\n'),
(3,2,'А сколько стоит доставка?','','&lt;p style=&quot;margin-top:0cm;margin-right:0cm;margin-bottom:5.35pt;margin-left:\r\n8.6pt;background:white&quot;&gt;\r\n	Доставка не включена в цену, указанную на сайте.&amp;nbsp;Стоимость ее зависит от способа оплаты и способа доставки курса, в процессе заказа в корзине ее сумма будет указана, исходя из выбранного способа оплаты и доставки.&lt;/p&gt;\r\n&lt;p style=&quot;margin-top:0cm;margin-right:0cm;margin-bottom:5.35pt;margin-left:\r\n8.6pt;background:white&quot;&gt;\r\n	Самая большая стоимость доставки будет при оплате наложенным платежом.&amp;nbsp;&lt;/p&gt;\r\n&lt;p style=&quot;margin-top:0cm;margin-right:0cm;margin-bottom:5.35pt;margin-left:\r\n8.6pt;background:white&quot;&gt;\r\n	При закачке курса по Интернету за доставку Вам платить не придется.&lt;/p&gt;\r\n'),
(3,1,'А сколько стоит доставка?','','&lt;p style=&quot;margin-top:0cm;margin-right:0cm;margin-bottom:5.35pt;margin-left:\r\n8.6pt;background:white&quot;&gt;\r\n	Доставка не включена в цену, указанную на сайте.&amp;nbsp;Стоимость ее зависит от способа оплаты и способа доставки курса, в процессе заказа в корзине ее сумма будет указана, исходя из выбранного способа оплаты и доставки.&lt;/p&gt;\r\n&lt;p style=&quot;margin-top:0cm;margin-right:0cm;margin-bottom:5.35pt;margin-left:\r\n8.6pt;background:white&quot;&gt;\r\n	Самая большая стоимость доставки будет при оплате наложенным платежом.&amp;nbsp;&lt;/p&gt;\r\n&lt;p style=&quot;margin-top:0cm;margin-right:0cm;margin-bottom:5.35pt;margin-left:\r\n8.6pt;background:white&quot;&gt;\r\n	При закачке курса по Интернету за доставку Вам платить не придется.&lt;/p&gt;\r\n');
/*!40000 ALTER TABLE `faq_description` ENABLE KEYS */;
UNLOCK TABLES;
