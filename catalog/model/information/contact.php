<?php
class ModelInformationContact extends Model {
  public function loadContacts() {
      if (!$this->config->get('contacts')) {
          $contacts = file_get_contents('catalog/contacts.json', FILE_USE_INCLUDE_PATH);
          $this->config->set('contacts', json_decode($contacts));
      }

      return $this->config->get('contacts');
  }

  public function getContact($name) {

      $contacts = $this->loadContacts();

      if ($name) {
          foreach ($contacts as $contact) {
              if ($contact->name == $name) {
                  return $contact;
              }
          }
      }
      return null;
  }
}
?>
