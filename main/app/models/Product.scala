package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class Product(id: Pk[Long], name: String)

object Product {
  // -- Parsers
  
  /**
   * Parse a Project from a ResultSet
   */
  val simple = {
    get[Pk[Long]]("product.id") ~/
    get[String]("product.name") ^^ {
      case id~name => Product(id, name)
    }
  }
  
  // -- Queries
    
  /**
   * Retrieve a Product from id.
   */
  def findById(id: Long): Option[Product] = {
    DB.withConnection { implicit connection =>
      SQL("select * from product where id = {id}").on(
        'id -> id
      ).as(Product.simple ?)
    }
  }

}

