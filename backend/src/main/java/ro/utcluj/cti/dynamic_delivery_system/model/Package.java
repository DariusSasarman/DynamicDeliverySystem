package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import ro.utcluj.cti.dynamic_delivery_system.model.User;

@Entity
@Table(name = "packages")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Package {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by_id", nullable = false)
    private BasicUser issuedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_courier_id")
    private DeliveryUser pickUpBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Manager managedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_courier_id")
    private DeliveryUser deliveredBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_to_id", nullable = false)
    private BasicUser issuedTo;

    @OneToMany(
        mappedBy = "pkg",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @OrderBy("timestamp ASC")
    private List<ChainOfOwnership> chainOfOwnership = new ArrayList<>();
    
    @Column(name = "pickup_date")
    private LocalDateTime pickUpDate;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PackageStatus status = PackageStatus.PENDING;

    public Package(Long id, BasicUser issuedBy, BasicUser issuedTo) {
        this.id = id;
        this.issuedBy = issuedBy;
        this.issuedTo = issuedTo;
        this.status = PackageStatus.PENDING;

        pickUpBy = null;
        managedBy = null;
        deliveredBy = null;
        pickUpDate = null;
        deliveryDate = null;

        chainOfOwnership.add(new ChainOfOwnership(this, issuedBy, LocalDateTime.now()));
    }

    public void setRequestedPickUpDate(LocalDateTime pickUpDate) {
        this.pickUpDate = pickUpDate;
    }

    public void setPickUpBy(DeliveryUser pickUpBy, LocalDateTime pickUpDate) {
        this.pickUpBy = pickUpBy;
        this.pickUpDate = pickUpDate;
    }
    
    public void hasBeenPickedUp(LocalDateTime pickUpDate) {
        status = PackageStatus.PICKED_UP;
        this.pickUpDate = pickUpDate;
        chainOfOwnership.add(new ChainOfOwnership(this, pickUpBy, LocalDateTime.now()));
    }

    public void setManagedBy(Manager managedBy) {
        this.managedBy = managedBy;
    }

    public void arrivedAtDeposit(LocalDateTime arrivalDate) {
        status = PackageStatus.IN_STORAGE;
        chainOfOwnership.add(new ChainOfOwnership(this, managedBy, LocalDateTime.now()));
    }

    public void initiateManagerTransfer(Manager newManager) {
        status = PackageStatus.PENDING;
        this.managedBy = newManager;
        this.pickUpBy = null;
        this.pickUpDate = null;
    }

    public void setDeliveredBy(DeliveryUser deliveredBy, LocalDateTime deliveryDate) {
        this.deliveredBy = deliveredBy;
        this.deliveryDate = deliveryDate;
        this.status = PackageStatus.OUT_FOR_DELIVERY;
        chainOfOwnership.add(new ChainOfOwnership(this, deliveredBy, LocalDateTime.now()));
    }

    public void hasBeenDelivered(LocalDateTime deliveryDate) {
        status = PackageStatus.DELIVERED;
        this.deliveryDate = deliveryDate;
        chainOfOwnership.add(new ChainOfOwnership(this, deliveredBy, LocalDateTime.now()));
        chainOfOwnership.add(new ChainOfOwnership(this, issuedTo, LocalDateTime.now()));
    }

    public String getConfirmationCode() {
        if(status != PackageStatus.OUT_FOR_DELIVERY) {
            throw new IllegalStateException("Package is not out for delivery");
        }
        if(deliveredBy == null) {
            throw new IllegalStateException("Package does not have a delivery user assigned");
        }
        String str = issuedBy.getEmail() + issuedTo.getEmail() + id;
        return String.format("%08X", str.hashCode());
    }


    public Location getLocation() {
        if (chainOfOwnership.isEmpty()) {
            return null;
        }
        User owner = chainOfOwnership.getLast().getOwner();
        if (owner == null) {
            return null;
        }
        return owner.getLocation();
    }

    public Location getPickupTargetLocation() {
        if (issuedBy == null || issuedBy.getSchedule() == null) {
            return null;
        }
        Location averageLocation = issuedBy.getSchedule().getAverageLocation();
        if (averageLocation != null) {
            return averageLocation;
        }
        return issuedBy.getLocation();
    }

    public Location getDeliveryTargetLocation() {
        if (issuedTo == null || issuedTo.getSchedule() == null) {
            return null;
        }
        Location averageLocation = issuedTo.getSchedule().getAverageLocation();
        if (averageLocation != null) {
            return averageLocation;
        }
        return issuedTo.getLocation();
    }

    public Location getResolvedLocation(boolean pickupAssignment) {
        Location location = getLocation();
        if (location != null) {
            return location;
        }
        return pickupAssignment ? getPickupTargetLocation() : getDeliveryTargetLocation();
    }

}
