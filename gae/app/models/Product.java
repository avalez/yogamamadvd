package models;

import play.modules.siena.EnhancedModel;
import siena.Generator;
import siena.Id;
import siena.Max;
import siena.Model;
import siena.Query;
import siena.Table;

import com.google.gson.Gson;


@Table("products")
public class Product extends EnhancedModel {

    @Id(Generator.AUTO_INCREMENT)
    public Long id;
    
    public String code;

    public String name;

    public String thumb;

    @Max(1000)
    public String description;

    public double price;

    public double special;

    public int rating;

    public int reviews;
    
    public String toString() {
      return name;
    }
    /*
    public static Product findById(String name) {
      return Model.getByKey(Product.class, name);
    }

    public static Query<Product> all() {
      return Model.all(Product.class);
    }
    */

    public static Product findByCode(String code) {
      return Product.all().filter("code", code).get();
    }
}
