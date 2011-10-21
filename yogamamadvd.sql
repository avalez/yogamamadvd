ALTER TABLE address add `country` varchar(128) COLLATE utf8_bin NOT NULL;
ALTER TABLE address add `zone` varchar(128) COLLATE utf8_bin NOT NULL,

/**
enable payments LiqPay
enable shipment free - 0, 
fix Yoga category name for russian language;
fix Yoga products links to store and to caregory;

update langauges set english sort order = 2;
update settngs set title, language, favicon, etc;
update extension slideshow set banner=commingsoon, 850x409;
*/

LOCK TABLES `layout` WRITE;
/*!40000 ALTER TABLE `layout` DISABLE KEYS */;
INSERT INTO `layout` VALUES (13,'Main');
/*!40000 ALTER TABLE `layout` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `layout_route` WRITE;
/*!40000 ALTER TABLE `layout_route` DISABLE KEYS */;
INSERT INTO `layout_route` VALUES (41,13,0,'common/main');
/*!40000 ALTER TABLE `layout_route` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `currency` WRITE;
/*!40000 ALTER TABLE `currency` DISABLE KEYS */;
INSERT INTO `currency` VALUES (4,'Русский рубль','RUR','','руб.','0',1.00000000,1,'2011-10-12 00:57:26');
/*!40000 ALTER TABLE `currency` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` VALUES (2,'Russian','ru','ru_RU.UTF-8','ru.png','russian','russian',1,1);
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
INSERT INTO `category_description` VALUES (59,1,'Yoga','','','');
/*!40000 ALTER TABLE `category_description` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `category_to_store` WRITE;
/*!40000 ALTER TABLE `category_to_store` DISABLE KEYS */;
INSERT INTO `category_to_store` VALUES (59,0);
/*!40000 ALTER TABLE `category_to_store` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES(50,'DVD1','','','',100,5,'data/yoga1.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,1,1,'2011-10-21 11:04:45','2011-10-21 11:29:32',0),(51,'DVD2','','','',100,5,'data/yoga2.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,2,1,'2011-10-21 11:18:13','2011-10-21 11:29:11',0),(52,'DVD3','','','',100,5,'data/yoga3.png',0,1,'19.0000',0,9,'2011-10-20','0.00',1,'0.00','0.00','0.00',1,1,1,3,1,'2011-10-21 11:19:45','2011-10-21 11:28:36',0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `product_description` WRITE;
/*!40000 ALTER TABLE `product_description` DISABLE KEYS */;
INSERT INTO `product_description` VALUES (50,2,'Йога для будущих мам 1 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в первом триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','',''),(50,1,'Yoga Mama DVD 1','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в первом триместре беременности, помогают будущим мамам справиться с тошнотой, изжогой, улучшить работу кишечника и, в результате, избежать недомоганий и токсикоза (либо облегчить его течение), нормализовать работу эндокринной системы, создать пространство между ребрами и тазовыми костями для развития плода, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Позитивные аффирмации настраивают на светлое протекание беременности, помогают «видеть» будущего малыша здоровым и счастливым.&lt;/p&gt;\r\n','',''),(51,2,'Йога для будущих мам 2 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем во втором триместре беременности, помогают будущим мамам разгрузить почки, снять отечность ног, растянуть мышцы промежности, улучшить кровообращение в области малого таза и всего организма, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Дыхательные упражнения помогают увеличить внутреннее пространство в грудной клетке и в области живота, чтобы малышу было куда расти, насытить организм мамы и малыша кислородом, направлять осознанное дыхание в область живота и в родовые пути.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n','',''),(51,1,'Yoga Mama DVD 2','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем во втором триместре беременности, помогают будущим мамам разгрузить почки, снять отечность ног, растянуть мышцы промежности, улучшить кровообращение в области малого таза и всего организма, сохранить мышцы в тонусе.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Дыхательные упражнения помогают увеличить внутреннее пространство в грудной клетке и в области живота, чтобы малышу было куда расти, насытить организм мамы и малыша кислородом, направлять осознанное дыхание в область живота и в родовые пути.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и стабилизировать работу нервной системы.&lt;/p&gt;\r\n','',''),(52,2,'Йога для будущих мам 3 триместр','&lt;p&gt;\r\n	Асаны (или иначе упражнения), которые мы выполняем в третьем триместре беременности, помогают будущим мамам разгрузить почки и предотвратить чрезмерное отекание ног, улучшить работу кишечника, уменьшить нагрузку на сердце, уменьшить боли в пояснице, подготовить мышцы и связки тазовой области к предстоящим родам.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Дыхательные техники, осваиваемые будущими мамами, помогают избежать боли при родах, насытить организм мамы и малыша кислородом.&lt;/p&gt;\r\n&lt;p&gt;\r\n	Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и научиться правильно расслабляться, что необходимо для успешного протекания родов.&lt;/p&gt;\r\n','',''),(52,1,'Yoga Mama DVD 3','&lt;p&gt;\r\n	&amp;lt;p&amp;gt;Асаны (или иначе упражнения), которые мы выполняем в третьем триместре беременности, помогают будущим мамам разгрузить почки и предотвратить чрезмерное отекание ног, улучшить работу кишечника, уменьшить нагрузку на сердце, уменьшить боли в пояснице, подготовить мышцы и связки тазовой области к предстоящим родам.&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;Дыхательные техники, осваиваемые будущими мамами, помогают избежать боли при родах, насытить организм мамы и малыша кислородом.&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;Практики на расслабление помогают избавиться от неуверенности, мнительности и страха, преследующего многих беременных женщин, и научиться правильно расслабляться, что необходимо для успешного протекания родов.&amp;lt;/p&amp;gt;&lt;/p&gt;\r\n','','');
/*!40000 ALTER TABLE `product_description` ENABLE KEYS */;
UNLOCK TABLES;
