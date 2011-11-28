package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class User (email: String, password: String)

object User {
  // -- Parsers
  
  /**
   * Parse a Project from a ResultSet
   */
  val simple = {
    get[String]("user.email") ~/
    get[String]("user.password") ^^ {
      case email~password => User(email, password)
    }
  }
  
  // -- Queries
    
  /**
   * Retrieve a User from id.
   */
  def findByEmail(email: String): Option[User] = {
    DB.withConnection { implicit connection =>
      SQL("select * from user where email = {email}").on(
        'email -> email
      ).as(User.simple ?)
    }
  }
  
  /**
   * Retrieve all users.
   */
  def findAll: Seq[User] = {
    DB.withConnection { implicit connection =>
      SQL("select * from user").as(User.simple *)
    }
  }
  
  /**
   * Create a User.
   */
  def create(user: User): User = {
    DB.withConnection { implicit connection =>
      SQL(
        """
insert into user values (
{email}, {password}
)
"""
      ).on(
        'email -> user.email,
        'password -> user.password
      ).executeUpdate()
      
      user
      
    }
  }
  

}

