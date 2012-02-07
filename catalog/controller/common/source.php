<?php
class ControllerCommonSource extends Controller
{
    /**
     *  Template
     */
    function index() {
      $name = $this->request->get['name'];
      $path = '/templates/' . $name . '.html';
  		if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . $path)) {
  			$template = $this->config->get('config_template') . $path;
  		} else {
  			$template = '../widget' . $path;
  		}
     
      $this->source($template);
    }

    /**
     *  Messages
     */
    function messages() {
      $name = $this->request->get['name'];
      $messages = '../widget/messages/' . $name . '.properties';
      $this->source($messages);
    }
    
    function source($path) {
     
  		ob_start();
    
  		readfile(DIR_TEMPLATE . $path);
    
  		$this->output = ob_get_contents();

  		ob_end_clean();
  		
  		$this->response->setOutput($this->output);
  		
    }
}

