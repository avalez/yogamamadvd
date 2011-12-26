import play.api._

import models._
import anorm._

object Global extends GlobalSettings {
  
  override def onStart(app: Application) {
    InitialData.insert()
  }
  
}

/**
* Initial set of data to be imported
* in the sample application.
*/
object InitialData {
  
  def date(str: String) = new java.text.SimpleDateFormat("yyyy-MM-dd").parse(str)
  
  def insert() = {
    
    if(User.findAll.isEmpty) {
      
      Seq(
        User("admin@example.com", "password")
      ).foreach(User.create)
      
      Seq(
        Gateway("post", "ondelivery"),
        Gateway("yandex", "internet"),
        Gateway("rbk", "visa_mastercard"),
        Gateway("webmoney", "internet"),
        Gateway("liqpay", "internet"),
        Gateway("qiwi", "normal"),
        Gateway("robokassa", "visa_mastercard"),
        Gateway("transfer", "normal"),
        Gateway("paypal", "internet, visa_mastercard"),
        Gateway("bank", "normal")
      ).foreach(Gateway.create)
    }
    
  }
  
}