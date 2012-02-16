package controllers

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto
import models._
import views._
import play.api.Routes

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
   * Retrieve complete user with address implicitly from the request.
   */
  implicit def user(implicit request: RequestHeader) = username.map { username =>
    // FIXME: user left join address
    User.findByEmail(username).map { user =>
      val address = Address.findByUserEmail(username).headOption
      User(user.firstname, user.lastname, user.email, address, user.password)
    }
  }.getOrElse(None)

  /**
   * Transparent support for partial redirect.
   */
  def Redirect(url: String)(implicit request: RequestHeader) = new Status(
    if(request.queryString.contains("partial")) {
      // avoid browser transparently handling the redirect 
      play.api.http.Status.OK
    } else {
      play.api.http.Status.FOUND
    }).withHeaders(LOCATION -> url)

  /**
   * Transparent support for partial redirect.
   */
  def Redirect(call: Call)(implicit request: RequestHeader): SimpleResult[Results.EmptyContent] = Redirect(call.url)
  
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
      routes.Account.login.url + "?returnUrl=" + encodeUrl(request.path))(request)

  /**
   * Translates a string into application/x-www-form-urlencoded format using "UTF-8" encoding scheme.
   */
  def encodeUrl = java.net.URLEncoder.encode(_:String, "UTF-8")


  /**
   * Retrieves form or query parameter from implicit request.
   */
  def requestParam(name: String, default: String = null)(implicit request: Request[AnyContent]) = (request.body.asFormUrlEncoded.getOrElse(Map.empty) ++
      request.queryString).get(name).map(_.head).getOrElse(default)

}

object Application extends ApplicationBase {
  
  def index = Action { implicit request =>
    Ok(html.index())
  }

  // -- Javascript routing

  def javascriptRoutes = Action {
    import routes.javascript._
    Ok(
      Routes.javascriptRouter("jsRoutes")(
        Checkout.addToCart, Checkout.removeFromCart, Checkout.updateShipment, Checkout.updatePayment
      )
    ).as("text/javascript")
  }}