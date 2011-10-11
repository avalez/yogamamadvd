package models;

import java.util.Date;
import java.util.List;

import models.crudsiena.SienaSupport;

import siena.Generator;
import siena.Id;
import siena.Table;
import siena.embed.Embedded;

@Table("shoping_order")
public class Order extends SienaSupport  {
  @Id(Generator.AUTO_INCREMENT)
  public Long id;

    /* TODO?
    public long invoice_no;
    public String invoice_prefix;
    */
    public User customer;
    //FIXME: @ManyToMany(cascade=CascadeType.PERSIST)
    @Embedded
    public List<OrderItem> items;
    /* see User
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
    */
    /*
    public String shipping_iso_code_2;
    public String shipping_iso_code_3;
    public String shipping_address_format;
    */
    public String shipping_method;
    /* TODO?
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
    */
    /*
    public String payment_iso_code_2;
    public String payment_iso_code_3;
    public String payment_address_format;
    */
    public String payment_method;
    //public String comment;
    public double total;
    //@ManyToOne
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
    //public String ip;
}