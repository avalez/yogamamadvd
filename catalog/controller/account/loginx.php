<?php
require_once(DIR_SYSTEM . 'library/resource.php');
class ControllerAccountLoginX extends Resource
{
    /**
     *  Is connected?
     */
    function get() {
        if (!$this->customer->isLogged()) {

            $this->forbidden(null);

        } else {

            $this->renderJson($this->customer);

        }
    }

    /**
     * Authenticate
     */
    function post($email, $password) {

        if (!$this->customer->login($email, $password)) {

            $this->language->load('account/login');
            $this->forbidden($this->language->get('error_login'));

        } else {

            $this->load->model('account/address');

            $address_info = $this->model_account_address->getAddress($this->customer->getAddressId());

            if ($address_info) {
                $this->tax->setZone($address_info['country_id'], $address_info['zone_id']);
            }

            $this->renderJson($this->customer);
        }
    }
}

