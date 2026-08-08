package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by_id", nullable = false)
    private Manager issuedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_to_id", nullable = false)
    private User issuedTo;

    @Column(nullable = false, length = 2000)
    private String invoiceDetails;

    @Column(nullable = false)
    private boolean confirmed;

    public record InvoiceSummary(Long id, String text) {}

    public Invoice(Manager issuedBy, User issuedTo, String invoiceDetails) {
        this.issuedBy = issuedBy;
        this.issuedTo = issuedTo;
        this.invoiceDetails = invoiceDetails;
        this.confirmed = false;
    }

    public void confirmInvoice() {
        this.confirmed = true;
    }
    
    public InvoiceSummary toInvoiceSummary() {
        return new InvoiceSummary(this.id, this.invoiceDetails);
    }
}
