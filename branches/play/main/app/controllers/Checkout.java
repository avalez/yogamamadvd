package controllers;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import models.Cart;
import models.User;
import models.Cart.Item;
import models.Product;

import play.Logger;
import play.data.validation.CheckWith;
import play.data.validation.Email;
import play.data.validation.Required;
import play.data.validation.Valid;
import play.libs.Crypto;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.With;

@With(Security.class)
public class Checkout extends Controller {

    @Before(unless = {"shipment", "downloadAndRegister", "shipAndRegister"})
    static void checkConnected() throws Throwable {
	 if(!Security.isConnected()) {
	     shipment();
	 }
    }

    @Before
    static void setCart() throws Throwable {
	Cart cart = Cart.fromJson(getCookie("cart"));
	renderArgs.put("cart", cart);
    }

    static Cart getCart() {
	return (Cart) renderArgs.get("cart");
    }

    public static void addToCart(@Required Long productId, @Required Long quantity) {
	if (validation.hasErrors()) {
	    error("productId and quantity are required");
	}
	Product product = Product.findById(productId);
	if (product == null) {
	    error("Product " + productId + " not foudn");
	}
	Cart cart = getCart();
	cart.add(productId, quantity, product.price);
	setCookie("cart", cart.toJson());
	
	//renderTemplate("/app/views/Checkout/addToCart.json", cart, product); 
	render(cart, product);
    }
    
    static String getCookie(String name) {
        Http.Cookie cookie = request.cookies.get(name);
        if(cookie != null && cookie.value.indexOf("-") > 0) {
            String sign = cookie.value.substring(0, cookie.value.indexOf("-"));
            String value = cookie.value.substring(cookie.value.indexOf("-") + 1);
            if(Crypto.sign(value).equals(sign)) {
        	return value;
            }
        }
        return null;
    }

    static void setCookie(String name, String value) {
        response.setCookie(name, Crypto.sign(value) + "-" + value);

    }

    public static void cart() {
	Cart cart = getCart();
	List<Product> products = new LinkedList<Product>();
	for (Long productId : cart.items.keySet()) {
	    Product product = Product.findById(productId);
	    if (product != null) {
		products.add(product);
	    }
	}
	render(products);
    }

    public static void updateCart(List<Long> remove, @Required Map<String, String> items) {
	if (!validation.hasErrors()) {
	    Cart cart = new Cart(); // reset

	    if (remove != null) {
		for (Long removeId : remove) {
		    items.remove(removeId.toString());
		}
	    }

	    for (String i : items.keySet()) {
		Long productId = Long.parseLong(i);
		Product product = Product.findById(productId);
		Long quantity = Long.parseLong(items.get(i));
		if (product != null) {
		    cart.add(productId, quantity, product.price);
		}
	    }

	    setCookie("cart", cart.toJson());
	}

	cart();
    }

    public static void shipment() throws Throwable {
	Object countries = Geonames.getCountries().get("geonames");
	render(countries);
    }

    public static void payment() throws Throwable {
	if (getCart().shipment != null) {
	    render();
	} else {
	    shipment();
	}
    }

    public static void checkout() throws Throwable {
	shipment();
    }

    static void setShipment(String shipment) throws Throwable {
	Cart cart = getCart();
	cart.shipment = shipment;
	setCookie("cart", cart.toJson());
    }

    public static void download() throws Throwable {
	setShipment("download");
	payment();
    }
    

    static void registerAndNext(User user) throws Throwable {
	user.save();
	Security.setConnectedUser(user);
	payment();
    }

    public static void downloadAndRegister(@Valid User user) throws Throwable {
	setShipment("download");
	if (validation.hasError("user.firstname")
		|| validation.hasError("user.lastname")
		|| validation.hasError("user.email")) {
	    flash.error("error_validation");
	    params.flash(); // add http parameters to the flash scope
	    validation.keep(); // keep the errors for the next request
	    shipment();
	} else {
	    registerAndNext(user);
	}
    }

    public static void ship() throws Throwable {
	setShipment("ship");
	payment();
    }

    public static void shipAndRegister(@Valid User user) throws Throwable {
	setShipment("ship");
	Map errors = validation.errorsMap();
	if (errors.size() == 3 && errors.containsKey("user")
		&& errors.containsKey("user.password")
		&& errors.containsKey("user.confirm")) {
	    registerAndNext(user);
	} else {
	    flash.error("error_validation");
	    params.flash(); // add http parameters to the flash scope
	    validation.keep(); // keep the errors for the next request
	    shipment();
	}
    }
}