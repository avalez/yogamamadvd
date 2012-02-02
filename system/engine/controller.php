<?php
abstract class Controller {
	protected $registry;	
	protected $id;
	protected $layout;
	protected $template;
	protected $children = array();
	protected $data = array();
	protected $output;
	
	public function __construct($registry) {
		$this->registry = $registry;
	}
	
	public function __get($key) {
		return $this->registry->get($key);
	}
	
	public function __set($key, $value) {
		$this->registry->set($key, $value);
	}
			
	protected function forward($route, $args = array()) {
		return new Action($route, $args);
	}

	protected function redirect($url, $status = 302) {
        header('Status: ' . $status);
        if (isset($this->request->get['partial'])) {
            $url .= '&partial=true';
        }
        if (isset($_GET['callback'])) {
            $json = array();
            $json['redirect'] = str_replace('&amp;', '&', $url);
            echo $_GET['callback'] . '(' .  json_encode($json) . ');';
        } else {
            header('Location: ' . str_replace('&amp;', '&', $url));
        }
		exit();
	}
	
	protected function getChild($child, $args = array()) {
		$action = new Action($child, $args);
		$file = $action->getFile();
		$class = $action->getClass();
		$method = $action->getMethod();
	
		if (file_exists($file)) {
			require_once($file);

			$controller = new $class($this->registry);
			
			$controller->$method($args);
			
			return $controller->output;
		} else {
			trigger_error('Error: Could not load controller ' . $child . '!');
			exit();					
		}		
	}
	
	protected function render() {
		foreach ($this->children as $child) {
            if (isset($this->request->get['partial'])
                && ($child == 'common/header' || $child == 'common/footer')) {
                $this->data[basename($child)] = "";
            } else if (isset($this->request->server['PATH_INFO'])
                && ($child == 'common/content_top' || $child == 'common/content_bottom')) {
                $this->data[basename($child)] = "";
            } else {
			    $this->data[basename($child)] = $this->getChild($child);
            }
		}
		
        if (isset($this->request->get['partial']) && $this->children) {

            foreach ($this->document->getLinks() as $link) {
              $this->output .= '<link rel="' . $link['rel'] . '" href="' . $style['href'] . '" />' . "\n";
            }
            foreach ($this->document->getStyles() as $style) {
              $this->output .= '<link rel="' . $style['rel'] . '" type="text/css" href="' . $style['href'] . '" media="' . $style['media'] . '" />' . "\n";
            }
            foreach ($this->document->getScripts() as $script) {
              $this->output .= '<script type="text/javascript" src="' . $script . '"></script>' . "\n";
            }

            $this->output .= '<title>' . $this->document->getTitle() . '</title>' . "\n";

        }

		if (file_exists(DIR_TEMPLATE . $this->template)) {
			extract($this->data);
			
      		ob_start();
      
	  		require(DIR_TEMPLATE . $this->template);
      
	  		$this->output .= ob_get_contents();

      		ob_end_clean();
      		
			return $this->output;
    	} else {
			trigger_error('Error: Could not load template ' . DIR_TEMPLATE . $this->template . '!');
			exit();				
    	}
	}
}
?>