package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
import jakarta.persistence.Table;
import java.time.LocalDateTime;

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
    }

    public void setPickUpBy(DeliveryUser pickUpBy, LocalDateTime pickUpDate) {
        this.pickUpBy = pickUpBy;
        this.pickUpDate = pickUpDate;
    }
    
    public void hasBeenPickedUp(LocalDateTime pickUpDate) {
        status = PackageStatus.PICKED_UP;
        this.pickUpDate = pickUpDate;
    }

    public void setManagedBy(Manager managedBy) {
        this.managedBy = managedBy;
    }

    public void arrivedAtDeposit(LocalDateTime arrivalDate) {
        status = PackageStatus.IN_STORAGE;
        this.deliveryDate = arrivalDate;
    }

    public void setDeliveredBy(DeliveryUser deliveredBy, LocalDateTime deliveryDate) {
        this.deliveredBy = deliveredBy;
        this.deliveryDate = deliveryDate;
    }

    public void hasBeenDelivered(LocalDateTime deliveryDate) {
        status = PackageStatus.DELIVERED;
        this.deliveryDate = deliveryDate;
    }

}
