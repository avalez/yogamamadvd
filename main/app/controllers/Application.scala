package controllers

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto

import models._
import views._

trait ApplicationBase extends Controller {
  /** Key of the USERNAME attribute stored in session. */
  val USERNAME = "username"

  /** Key of the REMEBERME attribute stored in cookie. */
  val COOKIE_NAME = "rememberme"

  /**
   * Retrieve user implicitly from the request.
   */
  implicit def username(implicit request: RequestHeader) = request.session.get(USERNAME).orElse(
     request.cookies.get(COOKIE_NAME).map( _.value ))

  /**
   * Transparent support for partial redirect.
   */
  def Redirect(url: String)(implicit request: RequestHeader): SimpleResult[Results.Empty] = {
    Status(if(request.queryString.contains("partial")) {
      // avoid browser transparently handling the redirect 
      play.api.http.Status.OK
    } else {
      play.api.http.Status.FOUND
    }).withHeaders(LOCATION -> url)
  }

  /**
   * Transparent support for partial redirect.
   */
  def Redirect(call: Call)(implicit request: RequestHeader): SimpleResult[Results.Empty] = Redirect(call.url)
  
  /**
   * Wraps another action, allowing only authenticated HTTP requests.
   *
   * The user name is retrieved from the session cookie, and passed as parameter.
   *
   * For example:
   * {{{
   * Authenticated { user =>
   *   Action { request =>
   *     Ok("Hello " + user)
   *   }
   * }
   * }}}
   *
   * @tparam A the type of the request body [FIXME]
   * @param username function used to retrieve the user name from the request header - the default is to read from session cookie
   * @param onUnauthorized function used to generate alternative result if the user is not authenticated - the default is a simple 401 page
   * @param action the action to wrap
   */
  def Authenticated(action: String => Request[AnyContent] => Result) = Action { implicit request =>
    username match {
      case None => onUnauthorized(request)
      case Some(name) => action(name)(request)
    }
  }

  /**
   * Redirect to login if the user is not authorized.
   */
  def onUnauthorized(request: RequestHeader) = Redirect(
      routes.Application.login.url + "?returnUrl=" + java.net.URLEncoder.encode(request.path))(request)
}

object Application extends ApplicationBase {
  
  def index = Action { implicit request =>
    Ok(html.index(User.findAll))
  }

  def account = Authenticated { user => implicit request =>
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
    Ok(html.login(loginForm, returnUrl))
  }

  /**
   * Handle login form submission.
   */
  def authenticate = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => BadRequest(html.login(formWithErrors, returnUrl)),
      user => {
        val result = Redirect(user._4).withSession("username" -> user._1)
        // rememberme
        if (user._3) result.withCookies(Cookie(COOKIE_NAME, Crypto.sign(user._1) + "-" + user._1))
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
    ).withCookies(Cookie(COOKIE_NAME, "", 0)) // remove
  }

}