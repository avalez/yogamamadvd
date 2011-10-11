package controllers;

import java.util.List;

import models.Cart;
import models.Product;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.With;

@With(Security.class)
public class Catalog extends Controller {

    @Before
    static void setCart() throws Throwable {
	Cart cart = Cart.fromJsonSafe(Checkout.getCookie("cart"));
	renderArgs.put("cart", cart);
    }

    public static void list() {
	List<Product> products = Product.all().fetch();
	Cart cart = Checkout.getCart();
	render(products, cart);
    }

    public static void show(Long id) {
	Product product = Product.findById(id);
	render(product);
    }
    
}
