package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class Product(product_id: Pk[Long], name: String, thumb: String, description: String, price: Double, special: Double = 0)

object Product {
  // -- Parsers
  
  /**
   * Parse a Product from a ResultSet
   */
  val simple = {
    get[Pk[Long]]("product.id") ~
    get[String]("product.name") ~
    get[String]("product.thumb") ~
    get[String]("product.description") ~
    get[Double]("product.price") map {
      case id~name~thumb~description~price => Product(id, name, thumb, description, price)
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
      ).as(simple *).headOption
    }
  }

  /**
   * Retrieve Products by id's.
   */
  def findByIds(ids: Seq[Long]): List[Product] = {
    DB.withConnection { implicit connection =>
      val idString = ids.map(_.toString)
      SQL("select * from product where id in (" + ids.map("{a" + _ + "}").reduceLeftOption(_ + ", " + _).
          getOrElse("") +")").onParams(ids.map(anorm.toParameterValue(_)) : _*).as(simple *)
    }
  }

  /**
   * Retrieve all Products.
   */
  def findAll = {
    DB.withConnection { implicit connection =>
      SQL("select * from product").as(simple *)
    }
  }

  /**
   * Create Product.
   */
  def create(product: Product): Product = {
    DB.withConnection { implicit connection =>
      SQL(
        """
insert into product(name, thumb, description, price) values (
{name}, {thumb}, {description}, {price}
)
"""
      ).on(
//        'id -> product.product_id,
        'name -> product.name,
        'thumb -> product.thumb,
        'description -> product.description,
        'price -> product.price
      ).executeUpdate()
      
      product
      
    }
  }
}

