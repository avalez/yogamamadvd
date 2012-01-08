package controllers;

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto
import models._
import views._

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

  val registerForm = Form(
    of(User.apply _)(
      "firstname" -> requiredText,
      "lastname" -> requiredText,
      "email" -> email,
      "password" -> requiredText,
      "confirm" -> requiredText
    ) verifying ("error_exists", result => result match {
      case (user) => User.findByEmail(user.email).isEmpty
    }) verifying ("error_confirm", result => result match {
      case (user) => user.password == user.confirmPassword
    })
  )
  
  /**
   * Login page.
   */
  def register = Action { implicit request =>
    Ok(html.account.register(registerForm, returnUrl))
  }

  // -- Utils
  
  def returnUrl(implicit request: RequestHeader) = request.queryString.get("returnUrl").map{ _.head }.getOrElse(routes.Application.index.url)
  
}