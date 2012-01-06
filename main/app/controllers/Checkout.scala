package controllers

import models.Cart
import play.api.mvc.AnyContent
import play.api.mvc.Request
import play.api.mvc.SimpleResult
import models.Gateway
import models.Product
import play.api.data._
import format.Formats._
import validation.Constraints._

object Checkout extends ApplicationBase {
  
  // shipment

  def shipment = WithCart { cart => implicit request =>
    Ok(views.html.checkout.shipment(Application.loginForm, cart))
  }

  def setshipment(shipment: String) = WithCart { cart => implicit request =>
    cart.shipment = shipment
    Redirect(routes.Checkout.payment)
  }

  def updateShipment = WithCart { cart => implicit request =>
    request.body.urlFormEncoded.get("shipment").map{
      shipment => cart.shipment = shipment.head
    }
    val gateways = Gateway.findAll
    Ok(views.html.tags.total(cart, gateways))
  }

  // payment
  
  def payment = WithCart { cart => implicit request =>
    // gateways reverse map (http://daily-scala.blogspot.com/2010/03/how-to-reverse-map.html)
    val gateways = (for (gateway <- Gateway.findAll; category <- "\\w+".r.findAllIn(gateway.categories))
      yield (gateway.name -> category)) groupBy( _._2) map {case (key,value) => (key, value.unzip._1)}
    // set initial payment category
    if (cart._category.isEmpty()) {
      cart._category = if (cart.shipment != "download") "ondelivery" else "internet"
    }
    Ok(views.html.checkout.payment(cart, gateways))
  }
  
  val gatewayForm = Form(
    of(
      "gateway" -> requiredText,
      "_category" -> requiredText
    )
  )

  def setpayment = WithCart { cart => implicit request =>
    gatewayForm.bindFromRequest.fold(
      hasErrors => Redirect(routes.Checkout.payment).flashing(
        "error" -> "Select payment method"),
      form => {
        cart.payment = form._1
        cart._category = form._2
        Redirect(routes.Checkout.product)
      }
    )
  }

  def updatePayment = WithCart { cart => implicit request =>
    val gateways = Gateway.findAll
    gatewayForm.bindFromRequest.fold(
      hasErrors => BadRequest(views.html.tags.total(cart, gateways)),
      form => {
        cart.payment = form._1
        cart._category = form._2
        Ok(views.html.tags.total(cart, gateways))
      }
    )
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
    val gateways = Gateway.findAll
    Ok(views.html.checkout.checkout(cart, products, gateways))
  }
  
  def removeFromCart = WithCart { cart => implicit request =>
    request.body.urlFormEncoded.get("productId").map(_.head).map { productId =>
      cart -= productId.toLong
    }
    val gateways = Gateway.findAll
    Ok(views.html.tags.total(cart, gateways))
  }
  
  def addToCart = WithCart { cart => implicit request =>
    val f = request.body.urlFormEncoded 
    (f.get("productId"), f.get("quantity")) match {
      case (Some(productId), Some(quantity)) => Product.findById(productId.head.toLong).map { product =>
        cart += (product, quantity.head.toLong)
      }
      case _ => Some(cart) // ignore
    }
    val gateways = Gateway.findAll
    Ok(views.html.tags.total(cart, gateways))
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

