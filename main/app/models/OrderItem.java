package models;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

import play.db.jpa.Model;

@Entity
public class OrderItem extends Model {
  @ManyToOne
  public Product product;
  public double quantity;
  public double total;
}
