<?php
require_once('template.php');
class ControllerWidgetMessages extends ControllerWidgetTemplate
{

  /**
   *  Messages
   */
  function get($name) {
    $messages = '../widget/messages/' . $name . '.properties';
    $this->source($messages);
  }
  
}
