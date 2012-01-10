package controllers;

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto
import models._
import views._
import anorm.Pk
import play.api.data.format.Formats
import anorm.Id
import play.api.data.format.Formatter
import anorm.Pk
import anorm.NotAssigned

object Account extends ApplicationBase {
  
  def index = Authenticated { user => implicit request =>
    Ok(html.account.index(user))
  }

  // -- Authentication

  val loginForm = Form(
    of(
      "username" -> email,
      "password" -> requiredText,
      "remember" -> boolean,
      "returnUrl" -> requiredText
    ) verifying ("Invalid email or password", result => result match {
      case (email, password, remember, returnUrl) => User.authenticate(email, password).isDefined
    })
  )
  
  /**
   * Login page.
   */
  def login = Action { implicit request =>
    Ok(html.account.login(loginForm, returnUrl))
  }

  /**
   * Handle login form submission.
   */
  def authenticate = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => BadRequest(html.account.login(formWithErrors, returnUrl)),
      user => {
        val result = Redirect(user._4).withSession("username" -> user._1)
        // rememberme
        if (user._3) result.withCookies(Cookie(COOKIE_NAME, Crypto.sign(user._1) + "-" + user._1))
        else result
      }
    )
  }
  
  /**
   * Logout and clean the session.
   */
  def logout = Action { implicit request =>
    Redirect(returnUrl).withNewSession.flashing(
      "success" -> "You've been logged out "
    ).withCookies(Cookie(COOKIE_NAME, "", 0)) // remove
  }

  // -- Registration

  /** Default formatter for the `Pk[Long]` type. */
  implicit def pkLongFormat = new Formatter[Pk[Long]] {

    override val format = Some("format.numeric", Nil)

    def bind(key: String, data: Map[String, String]) = {
      Formats.longFormat.bind(key, data).right.flatMap { s =>
        Right(Id(s))
      }
    }

    def unbind(key: String, value: Pk[Long]) = Map(key -> value.toString)
  }

  val registerForm = Form(
    of(User.apply _)(
      "firstname" -> requiredText,
      "lastname" -> requiredText,
      "email" -> email,
      "address" -> of(Address.apply _)(
          "id" -> of[Pk[Long]],
          "user_email" -> requiredText,
          "company" -> text,
          "address_1" -> requiredText,
          "address_2" -> text,
          "city" -> requiredText,
          "postcode" -> requiredText,
          "zone" -> requiredText,
          "country" -> requiredText,
          "country_code" -> requiredText
          ),
      "password" -> requiredText,
      "confirm" -> requiredText
    ) verifying ("error_exists", result => result match {
      case (user) => User.findByEmail(user.email).isEmpty
    }) verifying ("error_confirm", result => result match {
      case (user) => user.password == user.confirmPassword
    })
  )
  
  /**
   * Register page.
   */
  def register = Action { implicit request =>
    Ok(html.account.register(registerForm, returnUrl))
  }

  /**
   * Handle login form submission.
   */
  def doRegister = Action { implicit request =>
    registerForm.bindFromRequest.fold(
      formWithErrors => BadRequest(html.account.register(formWithErrors, returnUrl)),
      user => {
        User.create(user)
        Address.create(user.address)
        Redirect(returnUrl).withSession("username" -> user.email) 
      }
    )
  }

  // -- Utils
  
  def returnUrl(implicit request: RequestHeader) = request.queryString.get("returnUrl").map{ _.head }.getOrElse(routes.Application.index.url)
  
}