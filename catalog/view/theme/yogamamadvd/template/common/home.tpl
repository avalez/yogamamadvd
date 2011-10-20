<?php echo $header; ?>
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
<div id="content"></div>
<?php echo $footer; ?>


