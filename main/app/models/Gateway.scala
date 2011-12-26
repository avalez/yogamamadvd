package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class Gateway (name: String, categories: String)

object Gateway {
  // -- Parsers

  /**
   * Parse a Project from a ResultSet
   */
  val simple = {
    get[String]("gateway.name") ~/
    get[String]("gateway.categories") ^^ {
      case name~categories => Gateway(name, categories)
    }
  }

  // -- Queries

  /**
   * Retrieve all gateways.
   */
  def findAll = {
    DB.withConnection { implicit connection =>
      SQL("select * from gateway").as(simple *)
    }
  }


  /**
   * Create Gateway.
   */
  def create(gw: Gateway): Gateway = {
    DB.withConnection { implicit connection =>
      SQL(
        """
insert into gateway values (
{name}, {categories}
)
"""
      ).on(
        'name -> gw.name,
        'categories -> gw.categories
      ).executeUpdate()
      
      gw
      
    }
  }
}

