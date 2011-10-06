package controllers;

import java.util.ArrayList;

import models.Cart;
import models.Order;
import models.Product;
import models.Status;
import models.User;
import play.data.validation.CheckWith;
import play.data.validation.Email;
import play.data.validation.Required;
import play.data.validation.Valid;
import play.libs.Crypto;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.With;

@With(Security.class)
public class WS extends Controller {

  // Main ///////////////////////////////////////////////////////////////////

  // Account ////////////////////////////////////////////////////////////////

  public static void register(@Valid User user) {
    if (!validation.hasErrors()) {
      user.save();
      user.password = "***";
      renderJSON(user);
    } else {
      error("Errors: " + validation.errorsMap());
    }
  }
  
  public static void checkEmail(@Valid User user) {
    if (!validation.hasError("user.email")) {
      renderJSON(Boolean.TRUE);
    }
  }

  public static void registerShort(@Valid User user) {
    if (!(validation.hasError("user.firstname") ||
        validation.hasError("user.lastname") ||
        validation.hasError("user.email"))) {
      user.save();
      user.password = "***";
      renderJSON(user); 
    } else {
      error("Errors: " + validation.errorsMap());
    }
  }
  
  private static User getConnectedUser() {
    if (Security.isConnected() || remembered()) {
      return User.find("byEmail", Security.connected()).first();
    } else {
      forbidden();
      return null; // will not occur, forbidden throws Forbidden
    }
  }

  // allows full update but checks validates few feilds only
  public static void registerUpdate(@Valid User user) {
    if (!(validation.hasError("user.address_1") ||
        validation.hasError("user.city") ||
        validation.hasError("user.postcode") ||
        validation.hasError("user.country") ||
        validation.hasError("user.zone"))) {
      User current = getConnectedUser();
      current.edit("user", params.all());
      current.save();
      current.password = "***";
      renderJSON(current); 
    } else {
      error("Errors: " + validation.errorsMap());
    }
  }

  public static void connect(@Required @Email String username, @Required String password, boolean remember) {
    if (!validation.hasErrors()) {
      User user = User.find("byEmailAndPassword", username, password).first();
      if (user != null) {
        // Mark user as connected
        session.put("username", username);
        // Remember if needed
        if (remember) {
          response.setCookie("rememberme",
              Crypto.sign(username) + "-" + username, "30d");
        }
        user.password = "***";
        renderJSON(user);
      } else {
        forbidden();
      }
    } else {
      error("Errors: " + validation.errorsMap());
    }
  }

  private static boolean remembered() {
    Http.Cookie remember = request.cookies.get("rememberme");
    if (remember != null && remember.value.indexOf("-") > 0) {
      String sign = remember.value.substring(0, remember.value.indexOf("-"));
      String username = remember.value
          .substring(remember.value.indexOf("-") + 1);
      if (Crypto.sign(username).equals(sign)) {
        session.put("username", username);
        return true;
      }
    }
    return false;
  }

  public static void connected() {
    User user = getConnectedUser();
    user.password = "***";
    renderJSON(user);
  }

  public static void disconnect() {
    session.clear();
    response.removeCookie("rememberme");
  }
  
  public static void checkout(String jsonCart) {
    Cart cart = Cart.fromJson(jsonCart);
    Order order = new Order();
    order.customer =  getConnectedUser();
    order.products = new ArrayList<Product>(cart.quantity.intValue());
    for (Long productId : cart.items.keySet()) {
      Product product = Product.findById(productId);
      if (product != null) {
        Long quantity = cart.items.get(productId).quantity;
        for (long i = 0; i < quantity; i++) {
          order.products.add(product);
        }
        order.total = product.price * quantity;
        // assert order.total == cart.total
      }
    }
    order.shipping_method = cart.shipment;
    order.payment_method = cart.payment;
    order.order_status = Status.find("byName", Status.NEW).first();
    order.save();
    renderJSON(order);
  }
}