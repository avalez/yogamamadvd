<h1><?php echo $heading_title; ?></h1>
<div class="question-list">
  <?php foreach ($faqs as $topic) { ?>
  <div>
    <a class="off"><?php echo $topic['title']; ?></a>
    <div><?php echo $topic['description']; ?><br/ >
      <?php if ($topic['children']) { ?>
      <a href="<?php echo $topic['href']; ?>"><?php echo $button_more . ' (' . $topic['children'] . ')' ?></a>
      <?php } ?>
    </div>
  </div>
<?php } ?>
</div>
<div class="buttons">
  <div class="right"><a href="<?php echo $continue; ?>" class="button"><span><?php echo $button_continue; ?></span></a></div>
</div>

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
