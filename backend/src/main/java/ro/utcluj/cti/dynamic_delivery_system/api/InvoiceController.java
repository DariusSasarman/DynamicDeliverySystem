package ro.utcluj.cti.dynamic_delivery_system.api;

import java.util.List;
import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ro.utcluj.cti.dynamic_delivery_system.model.Invoice;
import ro.utcluj.cti.dynamic_delivery_system.repos.InvoiceRepository;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    @GetMapping("/count")
    public long getInvoiceCountForUser(Authentication authentication) {
        return invoiceRepository.findByIssuedToEmail(authentication.getName()).stream()
                .filter(Objects::nonNull)
                .count();
    }

    @GetMapping("/list")
    public List<Invoice.InvoiceSummary> getInvoicesForUser(Authentication authentication) {
        return invoiceRepository.findByIssuedToEmail(authentication.getName()).stream()
                .filter(Objects::nonNull)
                .map(Invoice::toInvoiceSummary)
                .toList();
    }

    @PostMapping("/confirm")
    public Invoice.InvoiceSummary confirmInvoice(@RequestParam Long invoiceId, Authentication authentication) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + invoiceId));

        if (!invoice.getIssuedTo().getEmail().equals(authentication.getName())) {
            throw new AccessDeniedException("You are not authorized to confirm this invoice.");
        }

        if (invoice.isConfirmed()) {
            throw new IllegalStateException("Invoice is already confirmed.");
        }

        invoice.confirmInvoice();
        return invoiceRepository.save(invoice).toInvoiceSummary();
    }
}