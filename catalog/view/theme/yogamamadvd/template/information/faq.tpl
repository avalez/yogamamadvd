<?php echo $header; ?><?php echo $column_left; ?><?php echo $column_right; ?>
<div id="content"><?php echo $content_top; ?>
  <div class="breadcrumb">
    <?php foreach ($breadcrumbs as $breadcrumb) { ?>
    <?php echo $breadcrumb['separator']; ?><a href="<?php echo $breadcrumb['href']; ?>"><?php echo $breadcrumb['text']; ?></a>
    <?php } ?>
  </div>
  <h1><?php echo $heading_title; ?></h1>
  <?php echo $description; ?>
  <?php if (isset($topics)) { ?>
    <div class="question-list">
    <?php foreach ($topics as $topic) { ?>
    <div><a class="off"><?php echo $topic['title']; ?></a>
      <div><?php echo $topic['description']; ?><br/ >
        <?php if ($topic['children']) { ?>
        <a href="<?php echo $topic['href']; ?>"><?php echo $button_more . ' (' . $topic['children'] . ')' ?></a>
        <?php } ?>
      </div>
    </div>
    <?php } ?>
    </div>
  <?php } ?>
  <div class="buttons">
    <?php if (isset($button_faq)) { ?>
    <div class="right"><a href="<?php echo $faq; ?>" class="button"><span><?php echo $button_faq; ?></span></a></div>
    <?php } else { ?>
    <div class="right"><a href="<?php echo $continue; ?>" class="button"><span><?php echo $button_continue; ?></span></a></div>
    <?php } ?>
  </div>
  <form action="<?php echo $action; ?>" method="post" enctype="multipart/form-data" id="contact">
    <h2><?php echo $text_contact; ?></h2>
    <div class="content">
    <b><?php echo $entry_name; ?></b><br />
    <input type="text" name="name" value="<?php echo $name; ?>" />
    <br />
    <br />
    <b><?php echo $entry_email; ?></b><br />
    <input type="text" name="email" value="<?php echo $email; ?>" />
    <br />
    <br />
    <b><?php echo $entry_subject; ?></b><br />
    <select name="subject" cols="40" rows="10" style="width: 49%;">
        <?php foreach ($contacts as $contact) { ?>
        <option value="<?php echo $contact->name; ?>"><?php echo $contact->title; ?></option>
        <?php } ?>
    </select>
    <br />
    <br />
    <b><?php echo $entry_enquiry; ?></b><br />
    <textarea name="enquiry" cols="40" rows="10" style="width: 99%;"><?php echo $enquiry; ?></textarea>
    <br />
    <br />
    <b><?php echo $entry_captcha; ?></b><br />
    <input type="text" name="captcha" value="<?php echo $captcha; ?>" />
    <br />
    <img src="index.php?route=information/contact/captcha" alt="" />
    </div>
    <div class="buttons">
      <div class="right"><a onclick="$('#contact').submit();" class="button"><span><?php echo $button_continue; ?></span></a></div>
    </div>
  </form>
  <?php echo $content_bottom; ?>
</div>
<?php echo $footer; ?>
<script language="javascript" type="text/javascript">
$(function () {
  var speed = 500;
  $('a.off').die('click');
  $('a.off').live('click', function(event){
    event.preventDefault();
    $('a.on').next().slideUp(speed);
    $('a.on').attr('class', 'off');
    $(this).attr('class', 'on');
    $(this).next().slideDown(speed);
  });
  $('a.on').die('click');
  $('a.on').live('click', function(event){
    event.preventDefault();
    $(this).attr('class', 'off');
    $(this).next().slideUp(speed);
  });
});
</script>
