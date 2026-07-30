package ro.utcluj.cti.dynamic_delivery_system.model;

import java.util.Date;

import jakarta.annotation.Generated;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;

@Entity
@Inheritance
@DiscriminatorColumn(name = "ROLE")  
public abstract class User {
    @Id
    @Generated(value = "org.hibernate.id.UUIDGenerator")
    private String id;  

    protected User(String email, String hashedPassword) {
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.createdAt = new Date();
    }

    private final String email;
    private final String hashedPassword;
    private final Date createdAt;

    public abstract AccountTypes getAccountType();

    public String getEmail() {
        return email;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public Date getCreatedAt() {
        return createdAt;
    }
}
