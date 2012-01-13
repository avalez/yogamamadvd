package controllers;

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto
import anorm.NotAssigned
import models._
import views._
import validation._
import play.api.templates.Html
import anorm.Pk

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
    ) verifying ("secure.error", result => result match {
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
  def doLogin = Action { implicit request =>
    realLogin(formWithErrors => html.account.login(formWithErrors, returnUrl))
  }
  
  def realLogin(view: (Form[(String, String, Boolean)]) => Html)(implicit request: Request[AnyContent]) =
    loginForm.bindFromRequest.fold(
      formWithErrors => BadRequest(view(formWithErrors)),
      user => {
        val result = Redirect(returnUrl).withSession("username" -> user._1)
        // rememberme
        if (user._3) result.withCookies(Cookie(COOKIE_NAME, Crypto.sign(user._1) + "-" + user._1))
        else result
      }.asInstanceOf[SimpleResult[Html]]
    )

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
  private def registerMapping(implicit request: Request[AnyContent], _type: String = "account") = 
    mapping(NotAssigned, requestParam("email"), _type)
  
  // user_emal 'call by name' is for static registerFormDownload when request is null
  private def mapping(addressId: Pk[Long], user_email: => String, _type: String)(implicit request: Request[AnyContent]) = of(User.apply _)(
    "firstname" -> requiredText,
    "lastname" -> requiredText,
    "email" -> email,
    "address" -> {if (_type != "download") {optional(addressMapping(addressId, user_email))} else {ignored(None)}},
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

  private def addressMapping(addressId: Pk[Long], email: String) = of(Address.apply _)(
    "id" -> ignored(addressId),
    "user_email" -> ignored(email),
    "company" -> text,
    "address_1" -> requiredText,
    "address_2" -> text,
    "city" -> requiredText,
    "postcode" -> requiredText,
    "zone" -> requiredText,
    "country" -> requiredText,
    "country_code" -> text
  ) 

  /**
   * Register page.
   */
  def register = Action { implicit request =>
    Ok(html.account.register(Form(registerMapping), returnUrl))
  }

  /**
   * Handle register form submission.
   */
  def doRegister = Action { implicit request =>
    realRegister(Form(registerMapping), formWithErrors => html.account.register(formWithErrors, returnUrl))
  }

  val registerFormDownload = Form(registerMapping(null, "download"))
  
  def registerFormShip(implicit request: Request[AnyContent]) = Form(registerMapping(request, "ship"))

  def realRegister(registerForm: Form[User], view: (Form[User]) => Html)(implicit request: Request[AnyContent]) =
    registerForm.bindFromRequest.fold(
      formWithErrors => BadRequest(view(formWithErrors)),
      user => {
        User.create(user)
        user.address.map(Address.create(_))
        Redirect(returnUrl).withSession("username" -> user.email).asInstanceOf[SimpleResult[Html]]
      }
    )

  // -- Utils

  def returnUrl(implicit request: Request[AnyContent]) = requestParam("returnUrl", routes.Application.index.url)

  /**
   * complete user with address
   */
  def addressForm(user: User)(implicit request: RequestHeader) = {
    val addressId = user.address.map(_.address_id).getOrElse(NotAssigned)
    Form(mapping(addressId, user.email, "ship")(request.asInstanceOf[Request[AnyContent]])).fill(user)
  }

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