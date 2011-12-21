package controllers

import play.api.mvc.Controller
import models.Cart

object Checkout extends Controller with PartialRedirect {
  def shipment = Security.AuthAware() {user => Action { implicit request =>
    val cart: Cart = new Cart()
    Ok(views.html.checkout.shipment(Application.loginForm, cart)(flash, request, user))
  }}

  def ship = Action { implicit request =>
    Redirect(routes.Application.index)
  }

  def download = Action { implicit request =>
    Redirect(routes.Application.index)
  }
}

