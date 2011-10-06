package models;

import java.util.Map;
import java.util.TreeMap;

import play.Logger;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;

public class Cart {
    // sorted!
    public TreeMap<Long, Item> items = new TreeMap<Long, Item>();
    public Long quantity = 0L;
    public Double total = 0D;
    public String shipment;
    public String payment;
    
    public void reset() {
	items.clear();
	quantity = 0L;
	total = 0D;
    }
    
    public void add(Long productId, Long quantity, Double price) {
	Item item = items.get(productId);
	if (item != null) {
	    item.quantity += quantity;
	    // price may have been changed
	    // FIXME: when adding discounts for multi-order
	    // TODO: use list instead of map or for value
	    //    or just item.total = item.price * item.quantity
	    //    depending on sales logic
	    item.price = price;
	    item.total += price * quantity;
	} else {
	    item = new Cart.Item(quantity, price);
	}
	items.put(productId, item);
	this.quantity += quantity;
	this.total += price * quantity;
	
    }
    
    public void remove(Long productId) {
    	Item item = items.remove(productId);
    	if (item != null) {
    		this.quantity -= item.quantity;
    		this.total -= item.total;
    	}
    }
    
    public static class Item {
	public Long quantity = 0L;
	public Double price = 0D;
	public Double total = 0D;
	
	public Item(Long quantity, double price) {
	    this.quantity = quantity;
	    this.price = price;
	    this.total += price * quantity;
	}
    }
    
    public static Cart fromJsonSafe(String json) {
	if (json != null) {
	    try {
	      return fromJson(json);
	    } catch (JsonParseException e) {
		Logger.warn("Invalid cart, ingoring: %s, %s", json,
		        e.getMessage());
	    }
	}
	return new Cart();
    }
    
    public static Cart fromJson(String json) {
      return new Gson().fromJson(json, Cart.class);
    }

    public String toJson() {
	return new Gson().toJson(this);
    }
}

