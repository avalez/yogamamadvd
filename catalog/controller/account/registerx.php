<?php
class ControllerAccountRegisterX extends Resource
{
    /**
     *  Check if exists
     */
    function get() {
      $this->language->load('account/register');

  		$this->load->model('account/customer');

    	if ($this->model_account_customer->getTotalCustomersByEmail($this->request->get['email'])) {

  	    $this->renderJson(false);

    	} else {

    	    $this->renderJson(true);

    	}

    }

    /**
     * Authenticate
     */
    function post() {
      $this->language->load('account/register');

  		$this->load->model('account/customer');

    	if ($this->validate()) {
			unset($this->session->data['guest']);
			

			$this->model_account_customer->addCustomer($this->request->post);

			$this->customer->login($this->request->post['email'], $this->request->post['password']);
			
			$this->renderJson($this->customerToUser($this->customer));
	  	  
    	} else {
    	  $this->error("Validation Errors", Resource::BADREQUEST);
    	} 

    }
    
    private function validate() {
      	if ((strlen(utf8_decode($this->request->post['firstname'])) < 1) || (strlen(utf8_decode($this->request->post['firstname'])) > 32)) {
        		$this->error['firstname'] = $this->language->get('error_firstname');
      	}

      	if ((strlen(utf8_decode($this->request->post['lastname'])) < 1) || (strlen(utf8_decode($this->request->post['lastname'])) > 32)) {
        		$this->error['lastname'] = $this->language->get('error_lastname');
      	}

      	if ((strlen(utf8_decode($this->request->post['email'])) > 96) || !preg_match('/^[^\@]+@.*\.[a-z]{2,6}$/i', $this->request->post['email'])) {
        		$this->error['email'] = $this->language->get('error_email');
      	}

      	if ($this->model_account_customer->getTotalCustomersByEmail($this->request->post['email'])) {
        		$this->error['warning'] = $this->language->get('error_exists');
      	}

      	if ((strlen(utf8_decode($this->request->post['telephone'])) < 3) || (strlen(utf8_decode($this->request->post['telephone'])) > 32)) {
        		$this->error['telephone'] = $this->language->get('error_telephone');
      	}

      	if ((strlen(utf8_decode($this->request->post['address_1'])) < 3) || (strlen(utf8_decode($this->request->post['address_1'])) > 128)) {
        		$this->error['address_1'] = $this->language->get('error_address_1');
      	}

      	if ((strlen(utf8_decode($this->request->post['city'])) < 2) || (strlen(utf8_decode($this->request->post['city'])) > 128)) {
        		$this->error['city'] = $this->language->get('error_city');
      	}

  		if ((strlen(utf8_decode($this->request->post['postcode'])) < 2) || (strlen(utf8_decode($this->request->post['postcode'])) > 10)) {
  			$this->error['postcode'] = $this->language->get('error_postcode');
  		}

      	if ($this->request->post['zone'] == '') {
        		$this->error['zone'] = $this->language->get('error_zone');
      	}

      	if ((strlen(utf8_decode($this->request->post['password'])) < 4) || (strlen(utf8_decode($this->request->post['password'])) > 20)) {
        		$this->error['password'] = $this->language->get('error_password');
      	}

      	if ($this->request->post['confirm'] != $this->request->post['password']) {
        		$this->error['confirm'] = $this->language->get('error_confirm');
      	}

  		if ($this->config->get('config_account_id')) {
  			$this->load->model('catalog/information');

  			$information_info = $this->model_catalog_information->getInformation($this->config->get('config_account_id'));

  			if ($information_info && !isset($this->request->post['agree'])) {
        			$this->error['warning'] = sprintf($this->language->get('error_agree'), $information_info['title']);
  			}
  		}

      	if (!$this->error) {
        		return true;
      	} else {
        		return false;
      	}
    }
}

