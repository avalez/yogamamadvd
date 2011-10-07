package models;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import play.db.jpa.Model;

@Entity
@Table(name="order_status", uniqueConstraints=@UniqueConstraint(columnNames="name"))
public class Status extends Model {
    public static final String NEW = "new";
    public String name;
    
    public String toString() {
      return name;
    }
}
