package controllers

import models.Cart
import play.api.mvc.AnyContent
import play.api.mvc.Request
import play.api.mvc.SimpleResult
import models.Gateway
import models.Product

object Checkout extends ApplicationBase {
  
  // shipment

  def shipment = WithCart { cart => implicit request =>
    Ok(views.html.checkout.shipment(Application.loginForm, cart))
  }

  def setshipment(shipment: String) = WithCart { cart => implicit request =>
    cart.shipment = shipment
    Redirect(routes.Checkout.payment)
  }

  // payment
  
  def payment = WithCart { cart => implicit request =>
    // gateways reverse map (http://daily-scala.blogspot.com/2010/03/how-to-reverse-map.html)
    val gateways = (for (gateway <- Gateway.findAll; category <- "\\w+".r.findAllIn(gateway.categories))
      yield (gateway.name -> category)) groupBy( _._2) map {case (key,value) => (key, value.unzip._1)}
    Ok(views.html.checkout.payment(cart, gateways))
  }
  
  def setpayment = WithCart { cart => implicit request =>
    val f = request.body.urlFormEncoded 
    (f.get("gateway"), f.get("_category")) match {
      case (Some(payment), Some(_category)) =>
        cart.payment = payment.head
        cart._category = _category.head
        Redirect(routes.Checkout.product)
      case _ => Redirect(routes.Checkout.payment).flashing(
        "error" -> "Select payment method")
    }
  }

  // product
  
  def product = WithCart { cart => implicit request =>
    val products = Product.findAll
    Ok(views.html.checkout.product(cart, products))
  }
  
  def setproduct = WithCart { cart => implicit request =>
    val f = request.body.urlFormEncoded
    val productsOption = f.get("products").orElse(f.get("products[]"))
    productsOption.map { products =>
      cart.clear
      for (product <- Product.findByIds(products.map(_.toLong))) {
        f.get("qties." + product.product_id).map { qties =>
          cart += (product, qties.head.toLong)
        }
      }
      Redirect(routes.Checkout.checkout)
    }.getOrElse(Redirect(routes.Checkout.product).flashing(
        "error" -> "Select product"))
  }

  // checkout
  
  def checkout = WithCart { cart => implicit request =>
    val products = Product.findAll
    Ok(views.html.checkout.checkout(cart, products))
  }
  
  def removeFromCart = WithCart { cart => implicit request =>
    request.body.urlFormEncoded.get("productId").map(_.head).map { productId =>
      cart.items.remove(productId.toLong)
    }
    Ok(views.html.checkout.updateCart(cart)).as("application/json")
  }

  def addToCart = WithCart { cart => implicit request =>
    val f = request.body.urlFormEncoded 
    (f.get("productId"), f.get("quantity")) match {
      case (Some(productId), Some(quantity)) => Product.findById(productId.head.toLong).map { product =>
        cart += (product, quantity.head.toLong)
      }
      case _ => Some(cart) // ignore
    }
    Ok(views.html.checkout.updateCart(cart)).as("application/json")
  }

  def docheckout = WithCart { cart => implicit request =>
    Redirect(routes.Checkout.checkout)
  }

  // wrapper

  def WithCart[A](action: Cart => Request[AnyContent] => SimpleResult[A]) = Action{ implicit request =>
    val cart = Cart.decodeFromCookie
    action(cart)(request).withCookies(Cart.encodeAsCookie(cart)) 
  }
  
}

