package ro.utcluj.cti.dynamic_delivery_system.model;

import jakarta.annotation.Generated;
import jakarta.persistence.Id;

public class Location {
    @Id
    @Generated(value = "org.hibernate.id.UUIDGenerator")
    private Long id;
    private double latitude;
    private double longitude;

    public Location(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }
}
