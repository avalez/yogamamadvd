package models;

import com.google.gson.Gson;

import controllers.Account;
import controllers.Security;
import play.data.validation.CheckWith;
import play.data.validation.Email;
import play.data.validation.Equals;
import play.data.validation.Phone;
import play.data.validation.Required;
import play.modules.siena.EnhancedModel;
import play.modules.siena.QueryWrapper;
import siena.Generator;
import siena.Id;
import siena.Query;
import siena.Table;

@Table("users")
public class User extends EnhancedModel {
    @Id(Generator.AUTO_INCREMENT)
    public Long id;

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

    public static User findByEmail(String email) {
      return User.all().filter("email", email).get();
    }

    public static User findByEmailAndPassword(String email, String password) {
      return User.all().filter("email", email).filter("password", password).get();
    }
}