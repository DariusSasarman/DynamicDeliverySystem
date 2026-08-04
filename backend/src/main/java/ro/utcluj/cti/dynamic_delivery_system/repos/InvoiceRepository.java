package ro.utcluj.cti.dynamic_delivery_system.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import ro.utcluj.cti.dynamic_delivery_system.model.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
}
