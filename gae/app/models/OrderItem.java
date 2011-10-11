package models;


import siena.embed.EmbeddedMap;

@EmbeddedMap
public class OrderItem  {
  public String product;
  public double quantity;
  public double total;
}
