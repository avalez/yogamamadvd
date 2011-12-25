package models

import play.api.mvc.CookieBaker
import scala.collection.mutable.ListMap
import play.api.mvc.RequestHeader

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
    // decode products string to map
    val products = "(\\d+)-(\\d+)".r.findAllIn(data.getOrElse("products", "")).matchData.foldLeft(new ListMap[Long, Long]) {
      (map, m) => map += m.group(0).toLong -> m.group(1).toLong
    }
    // add to cart
    Product.findByIds(products.keys.toSeq : _*).foldLeft(cart) { (cart, product) =>
      cart += (product -> products(product.id.get) /* quantity */) 
    }
  }

  def serialize(cart: Cart) = Map("shipment" -> cart.shipment,
    "payment" -> cart.payment,
    // encode into products string (flatten list)
    "products" -> { for (productId <- cart.items.keys)
      yield "" + productId + "-" + cart.items(productId).quantity}.toList.reduceLeftOption(_ + "," + _).getOrElse("")
    )

  def decodeFromCookie(implicit request: RequestHeader): Cart = decodeFromCookie(request.cookies.get(COOKIE_NAME))
}