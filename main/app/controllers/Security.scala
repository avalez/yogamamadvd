package controllers

import play.api._
import play.api.mvc._
import play.api.mvc.Results._

/** Helpers to create secure actions. */
object Security {

  /** Key of the USERNAME attribute stored in session. */
  val USERNAME = "username"

  /** Key of the REMEBERME attribute stored in cookie. */
  val COOKIE_NAME = "rememberme"

  /**
   * Wraps another action, to support authenticated HTTP requests.
   *
   * The user name is retrieved from the session cookie, and passed as option parameter.
   *
   * For example:
   * {{{
   * Authenticated { user =>
   *   Action { request =>
   *     Ok(user.map("Hello " + _))
   *   }
   * }
   * }}}
   *
   * @tparam A the type of the request body [FIXME]
   * @param username function used to retrieve the user name from the request header - the default is to read from session cookie
   * @param action the action to wrap
   */
  def AuthAware[A](
    username: RequestHeader => Option[String] = username)
    (action: Option[String] => Action[AnyContent]) = Action { implicit request =>
      action(username(request))(request)
  }

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
  def AuthAware[A](action: Option[String] => Action[AnyContent]): Action[AnyContent] = AuthAware()(action)

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
  def Authenticated[A](username: RequestHeader => Option[String] = username,
      onUnauthorized: RequestHeader => Result = onUnauthorized)
      (action: String => Action[AnyContent]) = Security.AuthAware(username) { user => {
    user match {
      case None => Action { request => onUnauthorized(request)}
      case Some(name) => action(name)
    }
  }}

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
  def Authenticated[A](action: String => Action[AnyContent]): Action[AnyContent] = Authenticated()(action)

  /**
   * Retrieve the connected user email.
   */
  def username(request: RequestHeader) = request.session.get(USERNAME).orElse(
     request.cookies.get(COOKIE_NAME).map( _.value ))



  /**
   * Redirect to login if the user is not authorized.
   */
  def onUnauthorized(request: RequestHeader) = Application.Redirect(
      routes.Application.login.url + "?returnUrl=" + request.path)(request)

}

