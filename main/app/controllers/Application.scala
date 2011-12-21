package controllers

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto

import models._
import views._

object Application extends Controller with PartialRedirect {
  def index = Security.AuthAware() { user => Action { implicit request =>
    Ok(html.index(User.findAll)(flash, request, user))
  }}

  def account = Security.Authenticated() { user => Action { implicit request =>
    Ok(html.account.index(user)(flash, request, Some(user)))
  }}

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
    Ok(html.login(loginForm, returnUrl)(flash, request, None))
  }

  /**
   * Handle login form submission.
   */
  def authenticate = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => BadRequest(html.login(formWithErrors, returnUrl)(flash, request, None)),
      user => {
        val result = Redirect(user._4).withSession("username" -> user._1)
        // rememberme
        if (user._3) result.withCookies(Cookie(Security.COOKIE_NAME, Crypto.sign(user._1) + "-" + user._1))
        else result
      }
    )
  }
  
  def returnUrl(implicit request: RequestHeader) = request.queryString.get("returnUrl").getOrElse(Seq(routes.Application.index.url)).first
  
  /**
   * Logout and clean the session.
   */
  def logout = Action { implicit request =>
    Redirect(returnUrl).withNewSession.flashing(
      "success" -> "You've been logged out "
    ).withCookies(Cookie(Security.COOKIE_NAME, "", 0)) // remove
  }

}


/**
 * Transparent support for partial redirect.
 */
trait PartialRedirect extends Results with play.api.http.HeaderNames {
  
  def Redirect(url: String)(implicit request: RequestHeader): SimpleResult[Results.Empty] = {
    Status(if(request.queryString.contains("partial")) {
      // avoid browser transparently handling the redirect 
      play.api.http.Status.OK
    } else {
      play.api.http.Status.FOUND
    }).withHeaders(LOCATION -> url)
  }

  def Redirect(call: Call)(implicit request: RequestHeader): SimpleResult[Results.Empty] = Redirect(call.url)
}