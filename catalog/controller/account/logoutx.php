<?php
class ControllerAccountLogoutX extends Resource
{
    /**
     *  Logout
     */
    function get() {
        if ($this->customer->isLogged()) {

      		  $this->customer->logout();

        }

    }

}

