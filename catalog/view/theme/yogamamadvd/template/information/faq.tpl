<?php echo $header; ?><?php echo $column_left; ?><?php echo $column_right; ?>
<div id="content"><?php echo $content_top; ?>
  <div class="breadcrumb">
    <?php foreach ($breadcrumbs as $breadcrumb) { ?>
    <?php echo $breadcrumb['separator']; ?><a href="<?php echo $breadcrumb['href']; ?>"><?php echo $breadcrumb['text']; ?></a>
    <?php } ?>
  </div>
  <h1><?php echo $heading_title; ?></h1>
  <div class="content">
    <?php echo $description; ?>
    <?php if (isset($topics)) { ?>
      <div class="content">
      <?php foreach ($topics as $topic) { ?>
      <div style="margin-bottom: 10px;"><a href="<?php echo $topic['href']; ?>"><?php echo $topic['title']; ?></a></div>
      <?php } ?>
      </div>
    <?php } ?>
  </div>
  <div class="buttons">
    <?php if (isset($button_faq)) { ?>
    <div class="right"><a onclick="location = '<?php echo $faq; ?>'" class="button"><span><?php echo $button_faq; ?></span></a></div>
    <?php } else { ?>
    <div class="right"><a onclick="location = '<?php echo $continue; ?>'" class="button"><span><?php echo $button_continue; ?></span></a></div>
    <?php } ?>
  </div>
  <?php echo $content_bottom; ?>
</div>
<?php echo $footer; ?>
