package controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import models.Cart;
import models.PaymentGateway;
import models.PaymentGatewayCategory;
import models.User;
import models.Cart.Item;
import models.Product;

import play.Logger;
import play.Play;
import play.data.validation.Check;
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
    static void checkConnected() {
	 if(!Security.isConnected()) {
	     shipment();
	 }
    }

    @Before
    static void setCart() {
	Cart cart = Cart.fromJsonSafe(getCookie("cart"));
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
	    error("Product " + productId + " not found");
	}
	Cart cart = getCart();
	cart.add(productId, quantity, product.price);
	setCookie("cart", cart.toJson());
	
	//renderTemplate("/app/views/Checkout/addToCart.json", cart, product); 
	render(cart, product);
    }
    
    public static void removeFromCart(@Required Long productId) {
    	if (validation.hasErrors()) {
    	    error("productId is required");
    	}
    	Product product = Product.findById(productId);
    	if (product == null) {
    	    error("Product " + productId + " not found");
    	}
    	Cart cart = getCart();
    	cart.remove(productId);
    	setCookie("cart", cart.toJson());
    	
    	//renderTemplate("/app/views/Checkout/removeFromCart.json", cart, product);
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

    ///////////////////////////////////////////////////////////////////////////

    public static void shipment() {
	Object countries = Geonames.getCountries().get("geonames");
	render(countries);
    }

    static void setShipment(String shipment) {
	Cart cart = getCart();
	cart.shipment = shipment;
	setCookie("cart", cart.toJson());
    }

    public static void download() {
	setShipment("download");
	payment();
    }
    

    static void registerAndNext(User user) {
	user.save();
	Security.setConnectedUser(user);
	payment();
    }

    public static void downloadAndRegister(@Valid User user) {
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

    public static void ship() {
	setShipment("ship");
	payment();
    }

    public static void shipAndRegister(@Valid User user) {
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

    ///////////////////////////////////////////////////////////////////////////

    public static void payment() {
	if (getCart().shipment != null) {
	    Map<PaymentGatewayCategory, List<PaymentGateway>> gateways =
		new HashMap<PaymentGatewayCategory, List<PaymentGateway>>();
	    List<PaymentGatewayCategory> categories = PaymentGatewayCategory.findAll();
	    for (PaymentGatewayCategory category : categories) {
		//List<PaymentGatewayToCategory> gwsToC = PaymentGatewayToCategory.find("byCategory", category).fetch();
		List<PaymentGateway> gws = PaymentGateway.findByCategory(category);
		gateways.put(category, gws);
	    }
	    render(gateways);
	} else {
	    shipment();
	}
    }

    public static void setPayment(@CheckWith(Checkout.ValidGateway.class) String gateway) {
	if (validation.hasErrors()) {
	    flash.error("error_validation");
	    params.flash(); // add http parameters to the flash scope
	    validation.keep(); // keep the errors for the next request
	    payment();
	} else {
	    Cart cart = getCart();
	    cart.payment = gateway;
	    setCookie("cart", cart.toJson());
	    product();
	}
    }

    public static class ValidGateway extends Check {
	@Override
        public boolean isSatisfied(Object validatedObject, Object value) {
	    setMessage("error_payment_gateway");
	    return PaymentGateway.find("byName", value).first() != null;
        }
    }
    
    ///////////////////////////////////////////////////////////////////////////
    
    public static void product() {
	Cart cart = getCart();
	if (cart.payment == null) {
	    payment();
	}
	List<Product> products = Product.findAll();
	render(products);
    }

    public static void setProduct(@Required(message = "error_product") List<Long> products, @Required Map<String, String> qties) {
	if (validation.hasErrors()) {
	    flash.error("error_validation");
	    params.flash(); // add http parameters to the flash scope
	    validation.keep(); // keep the errors for the next request
	    product();
	} else {
	    Cart cart = getCart();
	    cart.reset();

	    for (Long productId : products) {
		Product product = Product.findById(productId);
		if (product != null) {
		    Long qty = Long.parseLong(qties.get(productId.toString()));
		    cart.add(productId, qty, product.price);
		}
	    }

	    setCookie("cart", cart.toJson());
	    checkout();
	}

    }

    //////////////////////////////////////////////////////////////////////////

    public static void checkout() {
	Cart cart = getCart();
	if (cart.items.size() > 0) {
	    List<Product> products = Product.findAll();
	    List<Product> available = new LinkedList<Product>();
	    List<Product> selected = new LinkedList<Product>();
	    for (Product product: products) {
		if (cart.items.containsKey(product.id)) {
		    selected.add(product);
		} else {
		    available.add(product);
		}
	    }
	    render(selected, available, products);
	} else {
	    product();
	}
	
    }

}
