package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class Address(product_id: Pk[Long], user_id: Long, address_1: String, address_2: String,
    city: String, postcode: String, zone: String, country: String, country_code: String)

object Address {
  
  // -- Parsers

  /**
   * Parse a Project from a ResultSet
   */
  val simple = {
    get[Pk[Long]]("address.id") ~/
    get[Long]("address.user_id") ~/
    get[String]("address.address_1") ~/
    get[String]("address.address_2") ~/
    get[String]("address.city") ~/
    get[String]("address.postcode") ~/
    get[String]("address.zone") ~/
    get[String]("address.country") ~/
    get[String]("address.country_coude") ^^ {
      case id~user_id~address_1~address_2~city~postcode~zone~country~country_code =>
        Address(id, user_id, address_1, address_2, city, postcode, zone, country, country_code)
    }
  }

  // -- Queries

  /**
   * Retrieve a User from id.
   */
  def findById(id: Long): Option[Address] = {
    DB.withConnection { implicit connection =>
      SQL("select * from user where id = {id}").on(
        'id -> id
      ).as(simple ?)
    }
  }

  /**
   * Create.
   */
  def create(address: Address): Address = {
    DB.withConnection { implicit connection =>
      SQL(
        """
insert into address values (
          {user_id}, {address_1}, {address_2}, {city}, {postcode}, {zone}, {country}, {country_code}
)
"""
      ).on(
        'user_id -> address.user_id,
        'address_1 -> address.address_1,
        'address_2 -> address.address_2,
        'city -> address.city,
        'postcode -> address.postcode,
        'zone -> address.zone,
        'country -> address.country,
        'country_code -> address.country_code
      ).executeUpdate()
      
      address
      
    }
  }
  

}

