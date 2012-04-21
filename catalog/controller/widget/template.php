<?php
class ControllerWidgetTemplate extends Resource
{
    /**
     *  Template
     */
    function get($name) {
      $path = '/templates/' . $name . '.html';
  		if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . $path)) {
  			$template = $this->config->get('config_template') . $path;
  		} else {
  			$template = '../widget' . $path;
  		}
     
      $this->source($template);
    }

    function source($path) {
     
  		ob_start();
    
  		readfile(DIR_TEMPLATE . $path);
    
  		$output = ob_get_contents();

  		ob_end_clean();
  		
  		$this->response($output);
  		
    }
}

