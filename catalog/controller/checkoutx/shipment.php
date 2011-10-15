<?php   
class ControllerCheckoutXShipment extends Controller {
	public function index() {
  	if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . '/template/checkout/shipment.tpl')) {
  		$this->template = $this->config->get('config_template') . '/template/checkout/shipment.tpl';
  	} else {
  		$this->template = 'default/template/checkout/shipment.tpl';
  	}
	
  	$this->children = array(
  		'common/column_left',
  		'common/column_right',
  		'common/content_top',
  		'common/content_bottom',
  		'common/footer',
  		'common/header'	
  	);
			
  	$this->response->setOutput($this->render());
	}
}
?>