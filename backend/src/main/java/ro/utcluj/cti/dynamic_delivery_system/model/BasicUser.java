package ro.utcluj.cti.dynamic_delivery_system.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("BASIC")
public class BasicUser extends User {

    private Schedule schedule;

    private String phoneNumber;

    public BasicUser(String email, String hashedPassword, String phoneNumber) {
        super(email, hashedPassword);
        this.phoneNumber = phoneNumber;
    }

    @Override
    public AccountTypes getAccountType() {
        return AccountTypes.BASIC;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
}
