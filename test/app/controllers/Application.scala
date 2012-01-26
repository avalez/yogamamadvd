package controllers

import play.api._
import play.api.data._
import play.api.mvc._
import models._
import play.api.data.Forms._
import play.api.data.format.Formats._

object Application extends Controller {

  val test = Form(of(
    "email" -> optional(email),
    "address" -> optional(of(
       "address_1" -> text
    ))
  ))

  val form = Form(mapping(
    "email" -> optional(email),
    "address" -> optional(mapping(
       "address_1" -> text
    )(Address.apply)(Address.unapply))
  )(User.apply)(User.unapply))
  
  def index = Action {
    val user = User(Some("text@example.com"), Some(Address("Vinohradska 33")))
    Ok(views.html.index(form.fill(user), None))
  }
  
  def submit = Action { implicit request =>
    form.bindFromRequest().fold(
        formWithErrors => BadRequest(views.html.index(formWithErrors, None)),
        validUser => Ok(views.html.index(form.fill(validUser), Some(validUser))))
  }
}