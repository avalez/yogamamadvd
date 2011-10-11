package models;

import play.modules.siena.EnhancedModel;
import siena.Generator;
import siena.Id;
import siena.Table;

@Table("order_status")
public class Status extends EnhancedModel {
    public static final String NEW = "new";

    @Id(Generator.AUTO_INCREMENT)
    public Long id;

    public String name;
    
    public String toString() {
      return name;
    }
}
