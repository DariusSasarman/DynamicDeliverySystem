package ro.utcluj.cti.dynamic_delivery_system.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ro.utcluj.cti.dynamic_delivery_system.model.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    default List<Invoice> findByIssuedToEmail(String email) {
        return findAll().stream()
                .filter(invoice -> invoice.getIssuedTo().getEmail().equalsIgnoreCase(email))
                .toList();
    }

}