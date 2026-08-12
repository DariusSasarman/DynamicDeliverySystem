package ro.utcluj.cti.dynamic_delivery_system.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ro.utcluj.cti.dynamic_delivery_system.model.Invoice;
import ro.utcluj.cti.dynamic_delivery_system.model.Complaint;
import ro.utcluj.cti.dynamic_delivery_system.model.Package;
import ro.utcluj.cti.dynamic_delivery_system.model.Complaint.ComplaintSummary;
import ro.utcluj.cti.dynamic_delivery_system.model.DeliveryUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Location;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.model.PackageStatus;
import ro.utcluj.cti.dynamic_delivery_system.model.User;
import ro.utcluj.cti.dynamic_delivery_system.repos.ComplaintRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.InvoiceRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.PackageRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.UserRepository;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerUserController {
    
    private final UserRepository userRepository;
    private final PackageRepository packageRepository;
    private final InvoiceRepository invoiceRepository;
    private final ComplaintRepository complaintRepository;
    
    public record CourierLocation(String email, Double[] pos) {
        public CourierLocation(DeliveryUser courier) {
            this(courier.getEmail(), toPos(courier.getLocation()));
        }

        private static Double[] toPos(Location location) {
            if (location == null) {
                return null;
            }
            return new Double[]{location.getLatitude(), location.getLongitude()};
    }
}

    @GetMapping("/get-assigned-couriers")
    @PreAuthorize("hasRole('MANAGER')")
    public List<CourierLocation> getAssignedCouriers(Authentication authentication) {
        return userRepository.findByManager(getManagerFromAuthentication(authentication))
                .stream()
                .filter(DeliveryUser.class::isInstance)
                .map(DeliveryUser.class::cast)
                .map(CourierLocation::new)
                .collect(Collectors.toList());
    }


    @GetMapping("/picked-up-packages")
    @PreAuthorize("hasRole('MANAGER')")
    public List<Long> getPickedUpPackages(Authentication authentication) {
        return packageRepository.findByManagedBy(getManagerFromAuthentication(authentication))
                .stream()
                .filter(pkg -> pkg.getStatus() == PackageStatus.IN_STORAGE)
                .map(pkg -> pkg.getId())
                .collect(Collectors.toList());
    }

    @GetMapping("/pick-up-requests")
    @PreAuthorize("hasRole('MANAGER')")
    public List<Long> getPickUpRequests(Authentication authentication) {
        return packageRepository.findByManagedBy(getManagerFromAuthentication(authentication))
                .stream()
                .filter(pkg -> pkg.getStatus() == PackageStatus.PENDING)
                .map(pkg -> pkg.getId())
                .collect(Collectors.toList());
    }

    private record PackageAssignmentRequest(Long packageId, String email) {}
    @PostMapping("/assign-package")
    @PreAuthorize("hasRole('MANAGER')")
    @Transactional
    public void assignPackageToCourier(Authentication authentication, @RequestBody PackageAssignmentRequest request) {

        if (request.packageId() == null || request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Package ID and courier email are required");
        }

        Manager manager = getManagerFromAuthentication(authentication);

        User user = userRepository.findByEmailIgnoreCase(request.email())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Package pkg = packageRepository.findById(request.packageId())
            .orElseThrow(() -> new IllegalArgumentException("Package not found"));
        if (pkg.getManagedBy() == null || !pkg.getManagedBy().getEmail().equalsIgnoreCase(manager.getEmail())) {
            throw new IllegalArgumentException("Package is not managed by the current manager");
        }

        if (user instanceof Manager) {
            Manager transferManager = (Manager) user;
            if(pkg.getStatus() == PackageStatus.IN_STORAGE) {
                pkg.initiateManagerTransfer(transferManager);
                invoiceRepository.save(new Invoice(manager, transferManager, "You have been assigned to manage package with ID: " + pkg.getId()));
                packageRepository.save(pkg);
            } else {
                throw new IllegalArgumentException("Package is not in a state that can be transferred");
            }
        }
        else if(user instanceof DeliveryUser) {
            DeliveryUser courier = (DeliveryUser) user;

            if (courier.getManager() == null
                    || !courier.getManager().getEmail().equalsIgnoreCase(manager.getEmail())) {
                throw new IllegalArgumentException("Courier is not assigned to the current manager");
            }

            if(pkg.getStatus() == PackageStatus.PENDING) {
                pkg.setPickUpBy(courier, LocalDateTime.now());
                invoiceRepository.save(new Invoice(manager, courier, "You have been assigned to pick up package with ID: " + pkg.getId()));
                packageRepository.save(pkg);
            } else if(pkg.getStatus() == PackageStatus.IN_STORAGE) {
                pkg.setDeliveredBy(courier, LocalDateTime.now());
                invoiceRepository.save(new Invoice(manager, courier, "You have been assigned to deliver package with ID: " + pkg.getId()));
                packageRepository.save(pkg);
            } else {
                throw new IllegalArgumentException("Package is not in a state that can be assigned");
            }
        }
        else {
            throw new IllegalArgumentException("User is not a courier or manager");
        }
    }

    @GetMapping("/get-complaints")
    @PreAuthorize("hasRole('MANAGER')")
    public List<ComplaintSummary> getComplaints(Authentication authentication) {
        return complaintRepository.findByRegardingPackageManagedBy(getManagerFromAuthentication(authentication))
                .stream()
                .filter(complaint -> complaint.getSolutionInvoice() == null)
                .map(complaint -> complaint.toSummary())
                .collect(Collectors.toList());
    }
    
    private record ComplaintResolutionRequest(Long complaintId, String replyText) {}
    
    @PostMapping("/resolve-complaint")
    @PreAuthorize("hasRole('MANAGER')")
    @Transactional
    public void resolveComplaint(Authentication authentication, @RequestBody ComplaintResolutionRequest request) {

        if (request.complaintId() == null || request.replyText() == null || request.replyText().isBlank()) {
            throw new IllegalArgumentException("Complaint ID and reply text are required");
        }

        Manager manager = getManagerFromAuthentication(authentication);

        Complaint complaint = complaintRepository.findById(request.complaintId())
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));

        if(complaint.getRegardingPackage().getManagedBy() == null || !complaint.getRegardingPackage().getManagedBy().getEmail().equalsIgnoreCase(manager.getEmail())) {
            throw new IllegalArgumentException("Complaint is not related to a package managed by the current manager");
        }  

        Invoice solutionInvoice = new Invoice(manager, complaint.getFiledBy(), request.replyText());
        complaint.setSolutionInvoice(solutionInvoice);
        invoiceRepository.save(solutionInvoice);
        complaintRepository.save(complaint);

    }

    private record SendInvoiceRequest(String clientEmail, String text) {}

    @PostMapping("/send-invoice")
    @PreAuthorize("hasRole('MANAGER')")
    public void sendInvoice(Authentication authentication, @RequestBody SendInvoiceRequest request) {
        
        Manager manager = getManagerFromAuthentication(authentication);

        User client = userRepository.findByEmailIgnoreCase(request.clientEmail())
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        Invoice invoice = new Invoice(manager, client, request.text());
        invoiceRepository.save(invoice);
    }

    @GetMapping("/get-managers")
    @PreAuthorize("hasRole('MANAGER')")
    public List<String> getManagers(Authentication authentication) {
        return userRepository.findAll()
                .stream()
                .filter(user -> user instanceof Manager)
                .filter(user -> !user.getEmail().equalsIgnoreCase(authentication.getName()))
                .map(User::getEmail)
                .collect(Collectors.toList());
    }

    private Manager getManagerFromAuthentication(Authentication authentication) {
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .filter(user -> user instanceof Manager)
                .map(user -> (Manager) user)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found"));
    }
}
