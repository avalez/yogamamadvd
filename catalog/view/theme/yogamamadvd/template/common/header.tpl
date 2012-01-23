<?php if (isset($_SERVER['HTTP_USER_AGENT']) && !strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE 6')) echo '<?xml version="1.0" encoding="UTF-8"?>'. "\n"; ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="<?php echo $direction; ?>" lang="<?php echo $lang; ?>" xml:lang="<?php echo $lang; ?>">
<head>
<title><?php echo $title; ?></title>
<base href="<?php echo $base; ?>" />
<?php if ($description) { ?>
<meta name="description" content="<?php echo $description; ?>" />
<?php } ?>
<?php if ($keywords) { ?>
<meta name="keywords" content="<?php echo $keywords; ?>" />
<?php } ?>
<?php if ($icon) { ?>
<link href="<?php echo $icon; ?>" rel="shortcut icon" type="image/x-icon" />
<?php } ?>
<?php foreach ($links as $link) { ?>
<link href="<?php echo $link['href']; ?>" rel="<?php echo $link['rel']; ?>" />
<?php } ?>
<link rel="stylesheet" type="text/css" href="catalog/view/theme/yogamamadvd/stylesheet/stylesheet.css" />
<link rel="stylesheet" media="screen" href="catalog/view/theme/yogamamadvd/stylesheet/menu.css" type="text/css" >
<link rel="stylesheet" media="screen" href="catalog/view/theme/yogamamadvd/stylesheet/nav.css" type="text/css" >
<?php foreach ($styles as $style) { ?>
<link rel="<?php echo $style['rel']; ?>" type="text/css" href="<?php echo $style['href']; ?>" media="<?php echo $style['media']; ?>" />
<?php } ?>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" charset="utf-8"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/start/jquery-ui.css" />

<!--
<script type="text/javascript" src="catalog/view/javascript/jquery/jquery-1.6.1.min.js"></script>
<script type="text/javascript" src="catalog/view/javascript/jquery/ui/jquery-ui-1.8.9.custom.min.js"></script>
<link rel="stylesheet" type="text/css" href="catalog/view/javascript/jquery/ui/themes/ui-lightness/jquery-ui-1.8.9.custom.css" />
<script type="text/javascript" src="catalog/view/javascript/jquery/ui/external/jquery.cookie.js"></script>
<script type="text/javascript" src="catalog/view/javascript/jquery/fancybox/jquery.fancybox-1.3.4.pack.js"></script>
<link rel="stylesheet" type="text/css" href="catalog/view/javascript/jquery/fancybox/jquery.fancybox-1.3.4.css" media="screen" />
<script type="text/javascript" src="catalog/view/javascript/jquery/tabs.js"></script>
<script type="text/javascript" src="catalog/view/javascript/common.js"></script>
-->
<?php foreach ($scripts as $script) { ?>
<script type="text/javascript" src="<?php echo $script; ?>"></script>
<?php } ?>

<script type="text/javascript" src="catalog/view/javascript/sammy.min/sammy.js" charset="utf-8"></script>
<script type="text/javascript" src="catalog/view/javascript/sammy.min/plugins/sammy.title.js"></script>
<script type="text/javascript" src="catalog/view/javascript/sammy.min/plugins/sammy.tmpl.js"></script>
<script type="text/javascript" src="catalog/view/javascript/sammy.min/plugins/sammy.storage.js"></script>
<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js"></script>
<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.8.1/jquery.validate.min.js"></script>
<script type="text/javascript" src="catalog/view/javascript/app/i18n.js"></script>
<script type="text/javascript" src="catalog/view/javascript/app/main.js"></script>
<script type="text/javascript" src="catalog/view/javascript/app/checkout.js"></script>
<script type="text/javascript" src="catalog/view/javascript/app/account.js"></script>

<link rel="stylesheet" href="catalog/view/theme/yogamamadvd/stylesheet/customInput.css">
<link rel="stylesheet" href="catalog/view/theme/yogamamadvd/stylesheet/tipTip.css">
<script type="text/javascript" src="catalog/view/javascript/jquery/customInput.jquery.js"></script>
<script type="text/javascript" src="catalog/view/javascript/jquery/jquery.tipTip.minified.js"></script>

<script type="text/javascript" src="catalog/view/javascript/jquery/jquery.json-2.3.min.js"></script>
<script type="text/javascript" src="catalog/view/javascript/MM.js"></script>
<script type="text/javascript">
$(function() {
  <?php if ($logged) { ?>
    var user = <?php echo $user ?>;
    app.store.set('user', user);
  <?php } else { ?>
    app.store.clear('user');
  <?php } ?>
  app.store.set('connected', true) // TODO: remove, see also account.js#connnected
})
</script>

<!--[if IE 7]>
<link rel="stylesheet" type="text/css" href="catalog/view/theme/default/stylesheet/ie7.css" />
<![endif]-->
<!--[if lt IE 7]>
<link rel="stylesheet" type="text/css" href="catalog/view/theme/default/stylesheet/ie6.css" />
<script type="text/javascript" src="catalog/view/javascript/DD_belatedPNG_0.0.8a-min.js"></script>
<script type="text/javascript">
DD_belatedPNG.fix('#logo img');
</script>
<![endif]-->
<?php echo $google_analytics; ?>
</head>
<body onLoad="MM_preloadImages('catalog/view/theme/yogamamadvd/image/button-left.png', 'catalog/view/theme/yogamamadvd/image/button-right.png', 'catalog/view/theme/yogamamadvd/image/button-left-active.png', 'catalog/view/theme/yogamamadvd/image/button-right-active.png')">
<div id="container">
  <?php if ($logo) { ?>
  <div id="logo"><img src="<?php echo $logo; ?>" alt="<?php echo $name; ?>" title="<?php echo $name; ?>"/></div>
  <?php } ?>
  <div id="header">
        <div id="product"><img src="catalog/view/theme/yogamamadvd/image/product.png" alt="<?php echo $name; ?>" title="<?php echo $name; ?>"/></div>
        <div id="menu">
          <ul>
            <li><a href="#"><?php echo $text_home; ?></a></li>
            <li><a href="index.php/checkout/shipment"><?php echo $text_order; ?></a></li>
            <li><a href="index.php/account/account"><?php echo $text_account; ?></a></li>
            <li><a href="index.php?route=information/faq"><?php echo $text_faq; ?></a></li>
          </ul>
        </div>
        <div id="welcome">
          <?php if (!$logged) { ?>
          <?php echo $text_welcome; ?>
          <?php } else { ?>
          <?php echo $text_logged; ?>
          <?php } ?>
        </div>
        <div class="heading">
          <a href="#"><span id="cart_total">&nbsp;</span></a>
        </div>
    </div>
    <div id="notification"></div>
