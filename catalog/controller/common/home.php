<?php  
class ControllerCommonHome extends Controller {
	public function index() {
		$this->document->setTitle($this->config->get('config_title'));
		$this->document->setDescription($this->config->get('config_meta_description'));

    /*
		$this->document->addScript('catalog/view/javascript/sammy/sammy.js');
		$this->document->addScript('catalog/view/javascript/sammy.min/plugins/sammy.tmpl.js');
		$this->document->addScript('catalog/view/javascript/sammy.min/plugins/sammy.storage.js');
		$this->document->addScript('http://ajax.aspnetcdn.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js');
		$this->document->addScript('http://ajax.aspnetcdn.com/ajax/jquery.validate/1.8.1/jquery.validate.min.js');
		$this->document->addScript('catalog/view/javascript/app/i18n.js');
		$this->document->addScript('catalog/view/javascript/app/main.js');
		$this->document->addScript('catalog/view/javascript/app/checkout.js');
		$this->document->addScript('catalog/view/javascript/app/account.js');
		$this->document->addScript('catalog/view/javascript/jquery/customInput.jquery.js');
		$this->document->addScript('catalog/view/javascript/jquery/jquery.tipTip.minified.js');
		$this->document->addScript('catalog/view/javascript/jquery/jquery.json-2.3.min.js');

		$this->document->addStyle('catalog/view/theme/' . $this->config->get('config_template') . '/stylesheet/customInput.css');
		$this->document->addStyle('catalog/view/theme/' . $this->config->get('config_template') . '/stylesheet/tipTip.css');
		$this->document->addStyle('catalog/view/theme/' . $this->config->get('config_template') . '/stylesheet/slideshow.css');

		$this->data['logged'] = $this->customer->isLogged();
		$this->data['user'] = json_encode(Resource::customerToUser($this->customer));
    */
     
		$this->data['heading_title'] = $this->config->get('config_title');

		if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . '/template/common/home.tpl')) {
			$this->template = $this->config->get('config_template') . '/template/common/home.tpl';
		} else {
			$this->template = 'default/template/common/home.tpl';
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