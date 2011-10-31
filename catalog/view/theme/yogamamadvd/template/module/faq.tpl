<div class="box">
  <div class="box-heading"><?php echo $heading_title; ?></div>
  <div class="box-content">
    <div class="box-category">
      <ul>
        <?php foreach ($faqs as $faq) { ?>
        <li>
          <?php if ($faq['faq_id'] == $topic_id) { ?>
          <a href="<?php echo $faq['href']; ?>" class="active"><?php echo $faq['title']; ?></a>
          <?php } else { ?>
          <a href="<?php echo $faq['href']; ?>"><?php echo $faq['title']; ?></a>
          <?php } ?>
          <?php if ($faq['children']) { ?>
          <ul>
            <?php foreach ($faq['children'] as $child) { ?>
            <li>
              <?php if ($child['faq_id'] == $child_id) { ?>
              <a href="<?php echo $child['href']; ?>" class="active"> - <?php echo $child['title']; ?></a>
              <?php } else { ?>
              <a href="<?php echo $child['href']; ?>"> - <?php echo $child['title']; ?></a>
              <?php } ?>
            </li>
            <?php } ?>
          </ul>
          <?php } ?>
        </li>
        <?php } ?>
      </ul>
    </div>
  </div>
</div>
