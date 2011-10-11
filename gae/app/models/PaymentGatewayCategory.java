package models;

import play.modules.siena.EnhancedModel;
import siena.Generator;
import siena.Id;
import siena.Table;
import siena.embed.EmbeddedMap;

@EmbeddedMap
@Table("payment_gateway_categories")
public class PaymentGatewayCategory  extends EnhancedModel {
  
  @Id(Generator.AUTO_INCREMENT)
  public Long id;

  public String name;
/*
    public String toString() {
        return name;
    }

    public int compareTo(PaymentGatewayCategory category) {
        return name.compareTo(category.name);
    }
    */
}
