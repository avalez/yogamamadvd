package models

import play.api.db._
import play.api.Play.current

import anorm._
import anorm.SqlParser._

case class User(firstname: String, lastname: String, email: String, address: Option[Address], password: String, confirmPassword: String = "")

object User {
  
  // -- Parsers

  /**
   * Parse a Project from a ResultSet
   */
  val simple = {
    get[String]("user.firstname") ~/
    get[String]("user.lastname") ~/
    get[String]("user.email") ~/
    get[String]("user.password") ^^ {
      case firstname~lastname~email~password => User(firstname, lastname, email, None, password)
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
  * Authenticate a User.
  */
  def authenticate(email: String, password: String): Option[User] = {
    DB.withConnection { implicit connection =>
      SQL(
        """
select * from user where
email = {email} and password = {password}
"""
      ).on(
        'email -> email,
        'password -> password
      ).as(User.simple ?)
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
{firstname}, {lastname}, {email}, {password}
)
"""
      ).on(
        'firstname -> user.firstname,
        'lastname -> user.lastname,
        'email -> user.email,
        'password -> user.password
      ).executeUpdate()
      
      user
      
    }
  }
  

}

