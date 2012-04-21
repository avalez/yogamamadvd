<?php
require_once "common.php";
class ControllerOpenidLogin extends Controller
{
  function getOpenIDURL() {
      // Render a default page if we got a submission without an openid
      // value.
      if (empty($_GET['openid_identifier'])) {
          $error = "Expected an OpenID URL.";
          include 'index.php';
          exit(0);
      }

      return $_GET['openid_identifier'];
  }

  function index() {
      if(!isset($_SESSION)) {
        session_start();
      }
      
      $openid = $this->getOpenIDURL();
      $consumer = getConsumer();    
      // Begin the OpenID authentication process.
      $auth_request = $consumer->begin($openid);

      // No auth request means we can't begin OpenID.
      if (!$auth_request) {
          displayError($this, "Authentication error; not a valid OpenID.");
      }

      $sreg_request = Auth_OpenID_SRegRequest::build(
                                       // Required
                                       array('email', 'fullname'),
                                       // Optional
                                       array('nickname'));

      if ($sreg_request) {
          $auth_request->addExtension($sreg_request);
      }

  	$policy_uris = null;
  	if (isset($_GET['policies'])) {
      	$policy_uris = $_GET['policies'];
  	}

      $pape_request = new Auth_OpenID_PAPE_Request($policy_uris);
      if ($pape_request) {
          $auth_request->addExtension($pape_request);
      }

      // Redirect the user to the OpenID server for authentication.
      // Store the token for this authentication so we can verify the
      // response.

      // For OpenID 1, send a redirect.  For OpenID 2, use a Javascript
      // form to send a POST request to the server.
      if ($auth_request->shouldSendRedirect()) {
          $redirect_url = $auth_request->redirectURL(getTrustRoot(),
                                                     getReturnTo());

          // If the redirect URL can't be built, display an error
          // message.
          if (Auth_OpenID::isFailure($redirect_url)) {
              displayError($this, "Could not redirect to server: " . $redirect_url->message);
          } else {
              // Send redirect.
              header("Location: ".$redirect_url);
          }
      } else {
          // Generate form markup and render it.
          $form_id = 'openid_message';
          $form_html = $auth_request->htmlMarkup(getTrustRoot(), getReturnTo(),
                                                 false, array('id' => $form_id,
                                                 '_wpnonce' => $_GET['_wpnonce']));

          // Display an error if the form markup couldn't be generated;
          // otherwise, render the HTML.
          if (Auth_OpenID::isFailure($form_html)) {
              displayError($this, "Could not redirect to server: " . $form_html->message);
          } else {
              $this->response->setOutput($form_html);
          }
      }
  }

  function escape($thing) {
      return htmlentities($thing);
  }

  function dologin() {

      $consumer = getConsumer();

      // Complete the authentication process using the server's
      // response.
      $return_to = getReturnTo();
      //Auth_OpenID::log("QUERY_STRING0: %s", $_SERVER['QUERY_STRING']);
      $query = Auth_OpenID::params_from_string(html_entity_decode($_SERVER['QUERY_STRING']));
      $response = $consumer->complete($return_to, $query);

      // Check the response status.
      if ($response->status == Auth_OpenID_CANCEL) {
          // This means the authentication was cancelled.
          $msg = 'Verification cancelled.';
      } else if ($response->status == Auth_OpenID_FAILURE) {
          // Authentication failed; display the error message.
          $msg = "OpenID authentication failed: " . $response->message;
      } else if ($response->status == Auth_OpenID_SUCCESS) {
          // This means the authentication succeeded; extract the
          // identity URL and Simple Registration data (if it was
          // returned).
          $openid = $response->getDisplayIdentifier();
          $esc_identity = $this->escape($openid);

          $success = sprintf('You have successfully verified ' .
                             '<a href="%s">%s</a> as your identity.',
                             $esc_identity, $esc_identity);

          if ($response->endpoint->canonicalID) {
              $escaped_canonicalID = $this->escape($response->endpoint->canonicalID);
              $success .= '  (XRI CanonicalID: '.$escaped_canonicalID.') ';
          }

          $sreg_resp = Auth_OpenID_SRegResponse::fromSuccessResponse($response);

          $sreg = $sreg_resp->contents();

          if (isset($sreg['email'])) {
              $success .= "  You also returned '" . $this->escape($sreg['email']).
                  "' as your email.";
          }

          if (isset($sreg['nickname'])) {
              $success .= "  Your nickname is '" . $this->escape($sreg['nickname']).
                  "'.";
          }

          if (isset($sreg['fullname'])) {
              $success .= "  Your fullname is '" . $this->escape($sreg['fullname']).
                  "'.";
          }

          if (isset($sreg['firstname'])) {
              $success .= "  Your firstname is '" . $this->escape($sreg['firstname']).
                  "'.";
          }

          if (isset($sreg['lastname'])) {
              $success .= "  Your lastname is '" . $this->escape($sreg['lastname']).
                  "'.";
          }

          // force login or register
          unset($this->session->data['guest']);
          $email = $this->escape($sreg['email']);
          $password = $openid;
          if (!$this->customer->login($email, $password)) {
              $customer['firstname'] = '';
              $customer['lastname'] = '';
              $customer['email'] = $email;
              $customer['telephone'] = '';
              $customer['fax'] = '';
              $customer['password'] = $password;

          		$this->load->model('account/customer');
              $this->model_account_customer->addCustomer($customer);

              $this->customer->login($customer['email'], $customer['password']);
          }

  	$pape_resp = Auth_OpenID_PAPE_Response::fromSuccessResponse($response);

  	if ($pape_resp) {
              if ($pape_resp->auth_policies) {
                  $success .= "<p>The following PAPE policies affected the authentication:</p><ul>";

                  foreach ($pape_resp->auth_policies as $uri) {
                      $escaped_uri = escape($uri);
                      $success .= "<li><tt>$escaped_uri</tt></li>";
                  }

                  $success .= "</ul>";
              } else {
                  $success .= "<p>No PAPE policies affected the authentication.</p>";
              }

              if ($pape_resp->auth_age) {
                  $age = escape($pape_resp->auth_age);
                  $success .= "<p>The authentication age returned by the " .
                      "server is: <tt>".$age."</tt></p>";
              }

              if ($pape_resp->nist_auth_level) {
                  $auth_level = escape($pape_resp->nist_auth_level);
                  $success .= "<p>The NIST auth level returned by the " .
                      "server is: <tt>".$auth_level."</tt></p>";
              }

  	} else {
              $success .= "<p>No PAPE response was sent by the provider.</p>";
  	}

    $success .= "Redirect to: " . $_GET['target'];
      }
      
      if (isset($msg)) { $this->response->setOutput("<div class=\"alert\">$msg</div>"); }
      if (isset($error)) { $this->response->setOutput("<div class=\"error\">$error</div>"); }
      if (isset($success)) { $this->response->setOutput("<div>$success</div>"); }
  }

}


