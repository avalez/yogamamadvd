package controllers;

import play.api.mvc._
import play.api.data._
import play.api.libs.Crypto
import format.Formats
import format.Formatter
import anorm.NotAssigned
import models._
import views._
import play.api.data.validation.Constraint
import play.api.data.validation.Invalid
import play.api.data.validation.ValidationError
import play.api.data.validation.Valid

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
  def mapping(implicit request: Request[AnyContent]) = of(User.apply _)(
    "firstname" -> requiredText,
    "lastname" -> requiredText,
    "email" -> email,
    "address" -> of(Address.apply _)(
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
        ),
    "password" -> requiredText,
    "confirm" -> requiredText.verifying(Constraint[String]("constraint.equals") { o =>
          if (o == requestParam("password")) Valid
          else Invalid("error.equals")
    })
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