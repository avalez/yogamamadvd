package models;

import play.*;
import play.db.jpa.*;

import javax.persistence.*;

import java.util.*;

@Entity
@Table(name="shoping_order")
public class Order extends Model {

    public long invoice_no;
    public String invoice_prefix;
    @ManyToOne
    public User customer;
    @ManyToMany(cascade=CascadeType.PERSIST)
    public List<Product> products;
    public String shipping_firstname;
    public String shipping_lastname;
    public String shipping_company;
    public String shipping_address_1;
    public String shipping_address_2;
    public String shipping_postcode;
    public String shipping_city;
    public long shipping_zone_id;
    public String shipping_zone;
    public long shipping_country_id;
    public String shipping_country;
    /*
    public String shipping_iso_code_2;
    public String shipping_iso_code_3;
    public String shipping_address_format;
    */
    public String shipping_method;
    public String payment_firstname;
    public String payment_lastname;
    public String payment_company;
    public String payment_address_1;
    public String payment_address_2;
    public String payment_postcode;
    public String payment_city;
    public long payment_zone_id;
    public String payment_zone;
    public long payment_country_id;
    public String payment_country;
    /*
    public String payment_iso_code_2;
    public String payment_iso_code_3;
    public String payment_address_format;
    */
    public String payment_method;
    public String comment;
    public double total;
    public Status order_status;
    /*
    public String language_id;
    public String language_code;
    public String language_filename;
    public String language_directory;
    public String currency_id;
    public String currency_code;
    public String currency_value;
    */
    public Date date_modified;
    public Date date_added;
    public String ip;
}