package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "complaints")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Complaint {

    public record ComplaintSummary(Long id, Long packageId, String deliveredOn, String courierEmail, String complaintText) {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filed_by_id", nullable = false)
    private BasicUser filedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regarding_package_id", nullable = false)
    private Package regardingPackage;

    @Column(nullable = false, length = 4000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solution_invoice_id")
    private Invoice solutionInvoice;

    public Complaint( BasicUser filedBy, Package regardingPackage, String description) {
        this.filedBy = filedBy;
        this.regardingPackage = regardingPackage;
        this.description = description;
        this.solutionInvoice = null;
    }

    public void setSolutionInvoice(Invoice solutionInvoice) {
        this.solutionInvoice = solutionInvoice;
    }
    
    public ComplaintSummary toSummary() {
        return new ComplaintSummary(
            this.id,
            this.regardingPackage.getId(),
            this.regardingPackage.getDeliveryDate().toString(),
            this.regardingPackage.getDeliveredBy().getEmail(),
            this.description
        );
    }
}
