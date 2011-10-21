<?php
class ControllerAccountAddressX extends Resource
{
    /**
     *  Get address.
     */
    function get($addressId) {
        if (!$this->customer->isLogged()) {

            $this->forbidden(null);

        } else {

      		$this->load->model('account/address');

      		$address_data = $this->model_account_address->getAddress($addressId);
      		
      		if (!$address_data) {
      		  
      		  $this->error('Address Not Found', Resource::NOTFOUND);
      		  
      		} else {
      		  
            $this->renderJson(array('address' => $address_data));
      		}

        }
    }

    /**
     * Update/Create address
     */
    function post() {

      if (!$this->customer->isLogged()) {

          $this->forbidden(null);

      } else {

    		$this->load->model('account/address');
    		
    		if (!isset($this->request->post['firstname'])) {
    		  $this->request->post['firstname'] = $this->customer->getFirstName();
    		}

        if (!isset($this->request->post['lastname'])) {
    		  $this->request->post['lastname'] = $this->customer->getLastName();
  		  }

      	if ($this->validateForm()) {
      	  
      	  if (isset($this->request->post['address_id'])
      	      && $this->model_account_address->getAddress($addressId = $this->request->post['address_id'])) {
      	    
      	    $addressId = $this->request->post['address_id'];

         		$this->model_account_address->editAddress($addressId, $this->request->post);
      	    
      	  } else {

        		$this->request->post['default'] = true;

  			    $addressId = $this->model_account_address->addAddress($this->request->post);
  			    
			    }

  			  $this->renderJson(array('address_id' => $addressId));

			  } else {

			    $this->error("Validation Errors", Resource::BADREQUEST);

			  }

      }

    }

  	private function validateForm() {
    	if ((strlen(utf8_decode($this->request->post['address_1'])) < 3) || (strlen(utf8_decode($this->request->post['address_1'])) > 128)) {
      		$this->error['address_1'] = $this->language->get('error_address_1');
    	}

    	if ((strlen(utf8_decode($this->request->post['city'])) < 2) || (strlen(utf8_decode($this->request->post['city'])) > 128)) {
      		$this->error['city'] = $this->language->get('error_city');
    	}
		
		  if ((strlen(utf8_decode($this->request->post['postcode'])) < 2) || (strlen(utf8_decode($this->request->post['postcode'])) > 10)) {
			  $this->error['postcode'] = $this->language->get('error_postcode');
		  }
		
    	if ($this->request->post['country'] == '') {
      		$this->error['country'] = $this->language->get('error_country');
    	}
		
    	if ($this->request->post['zone'] == '') {
      		$this->error['zone'] = $this->language->get('error_zone');
    	}
		
    	if (!$this->error) {
      		return true;
  		} else {
      		return false;
    	}
  	}
}

