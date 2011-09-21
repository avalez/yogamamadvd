package models;

import play.*;
import play.db.jpa.*;

import javax.persistence.*;

import com.google.gson.Gson;

import java.util.*;

@Entity
public class Product extends Model {

    public String name;

    public String thumb;

    @Lob
    public String description;

    public double price;

    public double special;

    public int rating;

    public int reviews;

    public Product(String name) {
	this.name = name;
    }
}
