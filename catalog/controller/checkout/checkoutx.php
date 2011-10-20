<?php
class ControllerCheckoutCheckoutX extends Resource
{
    function getTotals(&$total_data, &$taxes) {
			$total = 0;
      
			$this->load->model('setting/extension');
			
			$sort_order = array(); 
			
			$results = $this->model_setting_extension->getExtensions('total');
			
			foreach ($results as $key => $value) {
				$sort_order[$key] = $this->config->get($value['code'] . '_sort_order');
			}
			
			array_multisort($sort_order, SORT_ASC, $results);
			
			foreach ($results as $result) {
				if ($this->config->get($result['code'] . '_status')) {
					$this->load->model('total/' . $result['code']);
		
					$this->{'model_total_' . $result['code']}->getTotal($total_data, $total, $taxes);
				}
			}
			
			
			$sort_order = array(); 
		  
			foreach ($total_data as $key => $value) {
				$sort_order[$key] = $value['sort_order'];
			}
	
			array_multisort($sort_order, SORT_ASC, $total_data);

			return $total;
      
    }

    /**
     * Update cart
     *
     * jsonCart
     * {"shipment":"download",
     *  "payment":"post",
     *  "items":{"1":{"quantity":1,"price":1,"total":1}},
     *  "quantity":1,
     *  "total":1,
     *  "additional_costs":1,
     *  "grand_total":2}
     */
    function post($jsonCart) {
      $cart = json_decode(html_entity_decode($jsonCart));
      
      if (!$cart || !$cart->shipment || !$cart->payment || !$cart->items) {
        $this->error("invalid cart", Resource::BADREQUEST);
        return;
      }

			$product_data = array();
      $this->cart->clear();
      foreach ($cart->items as $id => $product) {
        $this->cart->add($id, $product->quantity);
      }

      $shipping = $cart->shipment == 'download' ? 'free' : 'flat';

      if (!isset($this->session->data['shipping_method'])
          || $this->session->data['shipping_method']['code'] != $shipping . "." . $shipping) {
				// Shipping cost, see checkout/shipping.php
				$address_data = array(
				  'country_id'     => 0,
					'zone_id'        => 0
				);

				$this->load->model('setting/extension');
				
				$results = $this->model_setting_extension->getExtensions('shipping');
				
				foreach ($results as $result) {
					$total_data[] = $result;

					if ($result['code'] == $shipping && $this->config->get($result['code'] . '_status')) {
						$this->load->model('shipping/' . $result['code']);
						
						$quote = $this->{'model_shipping_' . $result['code']}->getQuote($address_data);
						
      			$this->session->data['shipping_method'] = $quote['quote'][$result['code']];

            // TODO: from languages
						$this->session->data['shipping_method']['title'] = 'Доставка'; 
						
						break;
					}
				}
			}

			$total_data = array();
			$taxes = $this->cart->getTaxes();
			$total = $this->getTotals($total_data, $taxes);

      $payment = $cart->payment == 'post' ? 'cod' : $cart->payment;
      
      $this->session->data['payment_method'] = null;

      if (!isset($this->session->data['payment_method'])
          || $this->session->data['payment_method']['code'] != $payment) {
				// Payment availability TODO
				$address_data = array(
				  'country_id'     => 0,
					'zone_id'        => 0
				);

				$this->load->model('setting/extension');
				
				$results = $this->model_setting_extension->getExtensions('payment');
		
				foreach ($results as $result) {
					if ($result['code'] == $payment && $this->config->get($result['code'] . '_status')) {
						$this->load->model('payment/' . $result['code']);
						
						$method = $this->{'model_payment_' . $result['code']}->getMethod($address_data, $total); 
						
    				$this->session->data['payment_method'] = $method;
    				
    				break;
					}
				}
							 
			}			

			$this->renderJson($total_data);

    }

    /**
     * Checkout, see checkout/confirm.php
     */
    function get() {
			$total_data = array();
			$taxes = $this->cart->getTaxes();
			$total = $this->getTotals($total_data, $taxes);

			$data = array();
			
			$data['invoice_prefix'] = $this->config->get('config_invoice_prefix');
			$data['store_id'] = $this->config->get('config_store_id');
			$data['store_name'] = $this->config->get('config_name');
			
			if ($data['store_id']) {
				$data['store_url'] = $this->config->get('config_url');		
			} else {
				$data['store_url'] = HTTP_SERVER;	
			}
			
  		if (!$this->customer->isLogged()) {
        $this->error("not logged in", Resource::BADREQUEST);
        return;
		  }
		  
			$data['customer_id'] = $this->customer->getId();
			$data['customer_group_id'] = $this->customer->getCustomerGroupId();
			$data['firstname'] = $this->customer->getFirstName();
			$data['lastname'] = $this->customer->getLastName();
			$data['email'] = $this->customer->getEmail();
			$data['telephone'] = $this->customer->getTelephone();
			$data['fax'] = $this->customer->getFax();
			
    	$this->load->model('account/address');

			$shipping_address = $this->model_account_address->getAddress($this->customer->getAddressId());

  		if ($this->session->data['shipping_method']['code'] == 'flat.flat' /* TODO: $this->cart->hasShipping() */ && !$shipping_address) {
        $this->error("no address", Resource::BADREQUEST);
			  return;
  		}

			$data['shipping_method'] = $this->session->data['shipping_method']['title'];

  		if (!$shipping_address) {
				$shipping_address['firstname'] = '';
				$shipping_address['lastname'] = '';	
				$shipping_address['company'] = '';	
				$shipping_address['address_1'] = '';
				$shipping_address['address_2'] = '';
				$shipping_address['city'] = '';
				$shipping_address['postcode'] = '';
				$shipping_address['zone'] = '';
				$shipping_address['zone_id'] = '';
				$shipping_address['country'] = '';
				$shipping_address['country_id'] = '';
				$shipping_address['address_format'] = '';
				$shipping_address['method'] = '';
		  }

		  $payment_address = $shipping_address;
		  
			$data['payment_firstname'] = $payment_address['firstname'];
			$data['payment_lastname'] = $payment_address['lastname'];	
			$data['payment_company'] = $payment_address['company'];	
			$data['payment_address_1'] = $payment_address['address_1'];
			$data['payment_address_2'] = $payment_address['address_2'];
			$data['payment_city'] = $payment_address['city'];
			$data['payment_postcode'] = $payment_address['postcode'];
			$data['payment_zone'] = $payment_address['zone'];
			$data['payment_zone_id'] = $payment_address['zone_id'];
			$data['payment_country'] = $payment_address['country'];
			$data['payment_country_id'] = $payment_address['country_id'];
			$data['payment_address_format'] = $payment_address['address_format'];


			$data['shipping_firstname'] = $shipping_address['firstname'];
			$data['shipping_lastname'] = $shipping_address['lastname'];	
			$data['shipping_company'] = $shipping_address['company'];	
			$data['shipping_address_1'] = $shipping_address['address_1'];
			$data['shipping_address_2'] = $shipping_address['address_2'];
			$data['shipping_city'] = $shipping_address['city'];
			$data['shipping_postcode'] = $shipping_address['postcode'];
			$data['shipping_zone'] = $shipping_address['zone'];
			$data['shipping_zone_id'] = $shipping_address['zone_id'];
			$data['shipping_country'] = $shipping_address['country'];
			$data['shipping_country_id'] = $shipping_address['country_id'];
			$data['shipping_address_format'] = $shipping_address['address_format'];

			$data['payment_method'] = $this->session->data['payment_method']['title'];

			$product_data = array();
      foreach ($this->cart->getProducts() as $product) {
				$product_data[] = array(
					'product_id' => $product['product_id'],
					'name'       => $product['name'],
					'model'      => $product['model'],
					'option'     => array(),
					'download'   => $product['download'],
					'quantity'   => $product['quantity'],
					'subtract'   => $product['subtract'],
					'price'      => $product['price'],
					'total'      => $product['total'],
					'tax'        => $this->tax->getRate($product['tax_class_id']),
					'href'        => $this->url->link('product/product', 'product_id=' . $product['product_id'])
				); 
      }
			
			$data['products'] = $product_data;
			$data['totals'] = $total_data;
			$data['comment'] = '';
			$data['total'] = $total;
			$data['reward'] = $this->cart->getTotalRewardPoints();
			
			if (isset($this->request->cookie['tracking'])) {
				$this->load->model('affiliate/affiliate');
				
				$affiliate_info = $this->model_affiliate_affiliate->getAffiliateByCode($this->request->cookie['tracking']);
				
				if ($affiliate_info) {
					$data['affiliate_id'] = $affiliate_info['affiliate_id']; 
					$data['commission'] = ($total / 100) * $affiliate_info['commission']; 
				} else {
					$data['affiliate_id'] = 0;
					$data['commission'] = 0;
				}
			} else {
				$data['affiliate_id'] = 0;
				$data['commission'] = 0;
			}
			
			$data['language_id'] = $this->config->get('config_language_id');
			$data['currency_id'] = $this->currency->getId();
			$data['currency_code'] = $this->currency->getCode();
			$data['currency_value'] = $this->currency->getValue($this->currency->getCode());
			$data['ip'] = $this->request->server['REMOTE_ADDR'];
			
			$this->load->model('checkout/order');
			
			$this->session->data['order_id'] = $this->model_checkout_order->create($data);

      $this->language->load('checkout/checkout');

			$this->data['column_name'] = $this->language->get('column_name');
			$this->data['column_model'] = $this->language->get('column_model');
			$this->data['column_quantity'] = $this->language->get('column_quantity');
			$this->data['column_price'] = $this->language->get('column_price');
			$this->data['column_total'] = $this->language->get('column_total');
	
			$this->data['products'] = $product_data;

			$this->data['vouchers'] = array();

			$this->data['totals'] = $total_data;
	
			$this->data['payment'] = $this->getChild('payment/' . $this->session->data['payment_method']['code']);
	
			if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . '/template/checkout/confirm.tpl')) {
				$this->template = $this->config->get('config_template') . '/template/checkout/confirm.tpl';
			} else {
				$this->template = 'default/template/checkout/confirm.tpl';
			}
		
			$json['output'] = $this->render();

  		$this->load->library('json');

  		$this->response->setOutput(Json::encode($json));		
	  	  
      
    }

    
}

