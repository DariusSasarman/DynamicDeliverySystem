package ro.utcluj.cti.dynamic_delivery_system.model;

import java.time.LocalDateTime;
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

    private final String email;
    private final String hashedPassword;
    private final LocalDateTime createdAt;


    protected User(String email, String hashedPassword) {
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.createdAt = LocalDateTime.now();
    }

    public abstract AccountTypes getAccountType();

    public String getEmail() {
        return email;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
