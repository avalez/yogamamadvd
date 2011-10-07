package models;

import java.util.*;
import javax.persistence.*;

import com.google.gson.Gson;

import controllers.Account;

import play.data.validation.*;
import play.db.jpa.*;

@Entity
public class User extends Model {

    @Required(message = "error_firstname")
    public String firstname;

    @Required(message = "error_lastname")
    public String lastname;

    @Required(message = "error_email")
    @Email(message = "error_email")
    @CheckWith(Account.Unique.class)
    public String email;

    @Required(message = "error_telephone")
    @Phone(message = "error_telephone")
    public String telephone;

    public String fax;

    public String company;

    @Required(message = "error_address_1")
    public String address_1;

    public String address_2;

    @Required(message = "error_city")
    public String city;

    @Required(message = "error_postcode")
    public String postcode;

    public long country_id;

    public long zone_id;

    @Required(message = "error_password")
    public String password;

    @Required(message = "error_confirm")
    @Equals("password")
    public String confirm;

    @Required(message = "error_country")
    public String country;

    @Required(message = "error_zone")
    public String zone;

    public boolean isAdmin;

    public String toJson() {
	return new Gson().toJson(this);
    }

    public String toString() {
      return (firstname != null ? firstname + " " : "")
        + (lastname != null ? lastname  + " " : "")
        + (firstname != null || lastname != null ? "<" : "")
        + email
        + (firstname != null || lastname != null ? ">" : "");
    }
}