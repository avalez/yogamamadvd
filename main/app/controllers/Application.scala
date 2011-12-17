package controllers

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto

import models._
import views._

object Application extends Controller {
  val COOKIE_NAME = "remember"
  
  def Redirect(call: Call)(implicit request: RequestHeader): SimpleResult[Results.Empty] = {
    Status(if(request.queryString.contains("partial")) {
      // avoid browser transparently handling the redirect 
      play.api.http.Status.OK
    } else {
      play.api.http.Status.FOUND
    }).withHeaders(LOCATION -> call.url)
  }

  def index = Action { implicit request =>
    Ok(html.index(User.findAll))
  }

  // -- Authentication

  val loginForm = Form(
    of(
      "username" -> email,
      "password" -> requiredText,
      "remember" -> boolean 
    ) verifying ("Invalid email or password", result => result match {
      case (email, password, remember) => User.authenticate(email, password).isDefined
    })
  )

  /**
   * Login page.
   */
  def login = Action { implicit request =>
    Ok(html.login(loginForm))
  }

  /**
   * Handle login form submission.
   */
  def authenticate = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => BadRequest(html.login(formWithErrors)),
      user => Redirect(routes.Application.index).withSession("username" -> user._1).withCookies(
        (if (user._3) Seq(Cookie(COOKIE_NAME, Crypto.sign(user._1) + "-" + user._1)) else Seq.empty) : _*)
    )
  }

  /**
   * Logout and clean the session.
   */
  def logout = Action { implicit request =>
    Redirect(routes.Application.login).withNewSession.flashing(
      "success" -> "You've been logged out"
    ).withCookies(Cookie(COOKIE_NAME, "", 0)) // remove
  }

}

/**
 * Provide security features
 */
trait Secured extends Security.AllAuthenticated {

  /**
   * Retrieve the connected user email.
   */
  override def username(request: RequestHeader) = request.session.get("username").orElse(
      request.cookies.get(Application.COOKIE_NAME).map( _.value ))

  /**
   * Redirect to login if the user is not authorized.
   */
  override def onUnauthorized(request: RequestHeader) = Results.Redirect(routes.Application.login)

}