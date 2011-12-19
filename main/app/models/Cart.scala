package models
import scala.collection.mutable.ListMap

class Cart {
  val items:ListMap[Long, Item] = new ListMap[Long, Item]
  val quantity: Long = 0
  val total:Double = 0d
  val shipment: String = ""
  val payment: String = ""   

  class Item {
    val quantity:Long = 0
    val price:Double = 0d
    val total:Double = 0d
  }
}
