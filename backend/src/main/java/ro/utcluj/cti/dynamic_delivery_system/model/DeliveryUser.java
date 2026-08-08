package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DeliveryUser extends User {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "made_by_id")
    private Manager madeBy;

    @Embedded
    private Location lastKnownLocation;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager;

    public DeliveryUser(Long id, String name, String email, String password, Manager madeBy, LocalDateTime createdAt, Manager manager) {
        super(id, name, email, password, AccountTypes.DELIVERY, createdAt);
        this.madeBy = madeBy;
        this.lastKnownLocation = null;
        this.manager = manager;
    }

    public void setLastKnownLocation(Location lastKnownLocation) {
        this.lastKnownLocation = lastKnownLocation;
    }

    @Override
    public String getRole() {
        return "DELIVERY";
    }

    @Override
    public Location getLocation() {
        return lastKnownLocation;  
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof DeliveryUser)) return false;
        DeliveryUser other = (DeliveryUser) obj;
        return this.getId().equals(other.getId());
    }
}
