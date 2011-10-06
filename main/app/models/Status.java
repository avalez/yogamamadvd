package models;

import play.*;
import play.db.jpa.*;

import javax.persistence.*;

import org.hibernate.annotations.Index;

import java.util.*;

@Entity
@Table(name="order_status")
public class Status extends Model {
    public static final String NEW = "new";
    @Index(name="idx_")
    public String name;
}
