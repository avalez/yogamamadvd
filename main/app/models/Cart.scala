package models

import play.api.mvc.CookieBaker
import scala.collection.mutable.ListMap

class Cart(var shipment: String = "", var payment: String = "") {
  var items:ListMap[Long, Item] = new ListMap[Long, Item]
  var quantity: Long = 0
  var total:Double = 0d
    
  def += (kv: (Product, Long)) = {
    val (id, quantity) = (kv._1.id.get, kv._2)
    val item = items.getOrElse(id, new Item(id, 0  /* FIXME */, 0))
    item.quantity += quantity
    item.total = item.price * item.quantity
    items += (id -> item)
    this
  }

  class Item(var quantity:Long, var price:Double, var total:Double)
}

object Cart extends CookieBaker[Cart] {
  
  val COOKIE_NAME = "cart"
  val emptyCookie = new Cart

  def deserialize(data: Map[String, String]) = {
    val cart = new Cart(data.getOrElse("payment", ""), data.getOrElse("shipment", ""))
    val products = data.getOrElse("products", "").split(",").foldLeft(new ListMap[Long, Long]) { (map, productId) => {
      val id = productId.toLong
      val q = map.getOrElse(id, 0.toLong /* WTF? */)
      map += (id -> (q + 1)) 
    }}
    Product.findByIds(products.keySet).foldLeft(cart) { (cart, product) =>
      cart += (product -> products(product.id.get)) 
    }
  }

  def serialize(cart: Cart) = Map("shipment" -> cart.shipment,
      "payment" -> cart.payment,
      "products" -> { for (productId <- cart.items.keySet; i <- 1L to cart.items(productId).quantity)
        yield productId.toString}.reduceLeft(_ + "," + _))
  
}