package controllers;

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto
import anorm.NotAssigned
import models._
import views._
import validation._
import play.api.templates.Html

object Account extends ApplicationBase {
  
  def index = Authenticated { user => implicit request =>
    Ok(html.account.index(user))
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
    Ok(html.account.login(loginForm, returnUrl))
  }

  /**
   * Handle login form submission.
   */
  def authenticate = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => BadRequest(html.account.login(formWithErrors, returnUrl)),
      user => {
        val result = Redirect(returnUrl).withSession("username" -> user._1)
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

  // dynamic mapping to refer other fields in Formatter and Constraint
  // see http://groups.google.com/group/play-framework/browse_thread/thread/64993b444f35e197
  // and satisfy registration through checkout wizar
  def mapping(implicit request: Request[AnyContent], _type: String = "account") = of(User.apply _)(
    "firstname" -> requiredText,
    "lastname" -> requiredText,
    "email" -> email,
    "address" -> {if (_type != "download") {of(Address.apply _)(
        "id" -> ignored(NotAssigned),
        "user_email" -> ignored(requestParam("email")),
        "company" -> text,
        "address_1" -> requiredText,
        "address_2" -> text,
        "city" -> requiredText,
        "postcode" -> requiredText,
        "zone" -> requiredText,
        "country" -> requiredText,
        "country_code" -> text
    )} else {ignored(null)}},
    "password" -> {if (_type == "account") { requiredText
      } else { /* TODO: generate password: */ ignored("password")}},
    "confirm" -> {if (_type == "account") {
      requiredText.verifying(Constraint[String]("constraint.equals") { o =>
          if (o == requestParam("password")) Valid
          else Invalid("error.equals")
      })
    } else { ignored(null)}}
  ) verifying ("error_exists", result => result match {
      case (user) => User.findByEmail(user.email).isEmpty
  })

  /**
   * Register page.
   */
  def register = Action { implicit request =>
    Ok(html.account.register(Form(mapping), returnUrl))
  }

  /**
   * Handle register form submission.
   */
  def doRegister = Action { implicit request =>
    Form(mapping).bindFromRequest.fold(
      formWithErrors => BadRequest(html.account.register(formWithErrors, returnUrl)),
      user => {
        User.create(user)
        Address.create(user.address)
        Redirect(returnUrl).withSession("username" -> user.email) 
      }
    )
  }

  val registerFormDownload = Form(mapping(null, "download"))
  
  def registerFormShip(implicit request: Request[AnyContent]) = Form(mapping(request, "ship"))

  def doRegisterDownload = Checkout.WithCart { cart => implicit request =>
    registerFormDownload.bindFromRequest.fold(
      formWithErrors => BadRequest(html.checkout.shipment(loginForm, formWithErrors, registerFormShip, cart)),
      user => {
        User.create(user)
        cart.shipment = "download"
        // ... set WithCart type parameter 
        Redirect(returnUrl).withSession("username" -> user.email).asInstanceOf[SimpleResult[Html]]
      }
    )
  }


  def doRegisterShip = Checkout.WithCart { cart => implicit request =>
    registerFormDownload.bindFromRequest.fold(
      formWithErrors => BadRequest(html.checkout.shipment(loginForm, registerFormDownload, formWithErrors, cart)),
      user => {
        User.create(user)
        cart.shipment = "ship"
        // ... set WithCart type parameter 
        Redirect(returnUrl).withSession("username" -> user.email).asInstanceOf[SimpleResult[Html]]
      }
    )
  }

  // -- Utils

  def returnUrl(implicit request: Request[AnyContent]) = requestParam("returnUrl", routes.Application.index.url)


  /** Default formatter for the `Pk[Long]` type.
  import anorm.Id
  import anorm.Pk
  
  implicit def pkLongFormat = new Formatter[Pk[Long]] {

    override val format = Some("format.numeric", Nil)

    def bind(key: String, data: Map[String, String]) = {
      Formats.longFormat.bind(key, data).right.flatMap { s =>
        Right(Id(s))
      }
    }

    def unbind(key: String, value: Pk[Long]) = Map(key -> value.toString)
  }
  */

}