package controllers

import models.Cart
import play.api.mvc.AnyContent
import play.api.mvc.Request
import play.api.mvc.SimpleResult

object Checkout extends ApplicationBase {
  def shipment = WithCart { cart => implicit request =>
    Ok(views.html.checkout.shipment(Application.loginForm, cart))
  }

  def ship = WithCart { cart => implicit request =>
    cart.shipment = "shipment"
    Redirect(routes.Application.index)
  }

  def download = WithCart { cart => implicit request =>
    cart.shipment = "download"
    Redirect(routes.Application.index)
  }

  def WithCart[A](action: Cart => Request[AnyContent] => SimpleResult[A]) = Action{ implicit request =>
    val cart = Cart.decodeFromCookie
    action(cart)(request).withCookies(Cart.encodeAsCookie(cart)) 
  }
  
}

