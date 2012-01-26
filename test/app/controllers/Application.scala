package controllers

import play.api._
import play.api.data._
import play.api.mvc._
import models.User
import models.Address


object Application extends Controller {

   val form = Form(of(User.apply _)(
    "email" -> optional(email),
    "address" -> optional(of(Address.apply _)(
        "address_1" -> requiredText
    ))
  ))
  
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