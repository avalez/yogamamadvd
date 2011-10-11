package models;

import java.util.List;

import play.modules.siena.EnhancedModel;

import models.crudsiena.SienaSupport;

import siena.Generator;
import siena.Id;
import siena.Model;
import siena.Table;
import siena.embed.Embedded;

@Table("payment_gateways")
public class PaymentGateway extends EnhancedModel {
  public static final String[] CATEGORIES = {"ondelivery", "internet", "normal", "visa_mastercard"};

  @Id(Generator.AUTO_INCREMENT)
  public Long id;

  public String name;

  public String category;

  public static List<PaymentGateway> findByCategory(
      String category) {
    return Model.all(PaymentGateway.class).filter("category", category).fetch();
  }

  public String toString() {
    return name;
  }

  public static PaymentGateway findByName(Object value) {
    return Model.all(PaymentGateway.class).filter("name", value).get();
  }
}
