package ro.utcluj.cti.dynamic_delivery_system.api;

import ro.utcluj.cti.dynamic_delivery_system.model.BasicUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Invoice;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.model.Package;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ro.utcluj.cti.dynamic_delivery_system.model.PackageStatus;
import ro.utcluj.cti.dynamic_delivery_system.model.User;
import ro.utcluj.cti.dynamic_delivery_system.repos.InvoiceRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.PackageRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.UserRepository;
import ro.utcluj.cti.dynamic_delivery_system.service.JwtService;

@RestController
@RequestMapping("/api/basic")
@RequiredArgsConstructor
public class BasicUserController {

    private final PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    
    public record PointOnMap(
            Long id,
            Double[] pos
    ) {
        public PointOnMap(Long id, Double longitude, Double latitude) {
            this(id, new Double[]{longitude, latitude});
        }
    }

    @GetMapping("/package-client-list")
    public List<PointOnMap> getPackageClientList(Authentication authentication) {
        String email = authentication.getName();
        List<PointOnMap> points = new ArrayList<>();
        packageRepository.findByIssuedToEmail(email)
                .stream()
                .filter(pkg -> pkg.getStatus().equals(PackageStatus.OUT_FOR_DELIVERY))
                .filter(pkg -> pkg.getDeliveredBy() != null && pkg.getDeliveredBy().getLastKnownLocation() != null)
                .forEach(pkg -> {
                    points.add(new PointOnMap(
                            pkg.getId(),
                            pkg.getDeliveredBy().getLastKnownLocation().getLongitude(),
                            pkg.getDeliveredBy().getLastKnownLocation().getLatitude()));
                });
        return points;
    }

    @GetMapping("/delivered-package-client-list")
    public List<Long> getDeliveredPackageClientList(Authentication authentication) {
        String email = authentication.getName();
        List<Long> packageIds = new ArrayList<>();
        packageRepository.findByIssuedToEmail(email)
                .stream()
                .filter(pkg -> pkg.getStatus().equals(PackageStatus.DELIVERED))
                .filter(pkg -> pkg.getDeliveredBy() != null)
                .forEach(pkg -> {
                    packageIds.add(pkg.getId());
                });
        return packageIds;
    }

    public record DeliveryConfirmationRequest(
            Long packageId,
            String deliveryCode) {
    }

    @PostMapping("/delivery-confirmation")
    public Map<String, Boolean> getDeliveryConfirmation(
            Authentication authentication,
            @RequestBody DeliveryConfirmationRequest request) {
        String email = authentication.getName();

        Long packageId = request.packageId();
        String deliveryCode = request.deliveryCode();

        boolean valid = packageRepository.findByIssuedToEmail(email)
                .stream()
                .anyMatch(pkg -> pkg.getId().equals(packageId) &&
                        pkg.getStatus().equals(PackageStatus.OUT_FOR_DELIVERY) &&
                        pkg.getConfirmationCode().equals(deliveryCode));

        if (valid) {
            packageRepository.findById(packageId).ifPresent(pkg -> {
                pkg.hasBeenDelivered(java.time.LocalDateTime.now());
                packageRepository.save(pkg);
            });
        }

        return Map.of("confirmation", valid);
    }

    public record PickupRequest(
            LocalDateTime pickupDate,
            String receiverEmail) {
    }
    
    @PostMapping("/pickup-request")
    @Transactional
    public Map<String, Boolean> sendPickupRequest(
            Authentication authentication,
            @RequestBody PickupRequest request) {
        String email = authentication.getName();
        
        if(email.equalsIgnoreCase(request.receiverEmail()) || request.pickupDate().isBefore(LocalDateTime.now())) {
            return Map.of("success", false);
        }

        Optional<User> issuedByRetrieval = userRepository.findByEmailIgnoreCase(email);
        if(issuedByRetrieval.isEmpty()) {
            return Map.of("success", false);
        }

        if(!(issuedByRetrieval.get() instanceof BasicUser issuedBy)) {
            return Map.of("success", false);
        }

        Optional<User> issuedToRetrieval = userRepository.findByEmailIgnoreCase(request.receiverEmail());
        if(issuedToRetrieval.isEmpty()) {
            return Map.of("success", false);
        }
        if(!(issuedToRetrieval.get() instanceof BasicUser issuedTo)) {
            return Map.of("success", false);
        }

        if(issuedBy.getSchedule() == null || issuedBy.getSchedule().getAverageLocation() == null) {
            return Map.of("success", false);
        }

        Optional<Manager> manager = userRepository.findNearestManagerByLocation(issuedBy.getSchedule().getAverageLocation().getLongitude(), issuedBy.getSchedule().getAverageLocation().getLatitude());
        if(manager.isEmpty()) {
            return Map.of("success", false);
        }
        
        Manager nearestManager = manager.get();

        Package pkg = new Package(null, issuedBy, issuedTo);

        // Assign someone to handle the pick-up and delivery of the package
        // For simplicity, we are assigning the nearest manager to handle the package
        pkg.setManagedBy(nearestManager);
        
        // Save the package to the database
        packageRepository.save(pkg);

        // Notify both users about the package creation and the manager that will handle it
        Invoice invoice = new Invoice(nearestManager, issuedTo, "You got a new package coming towards you!");
        Invoice invoice2 = new Invoice(nearestManager, issuedBy, "You sent a package to " + issuedTo.getEmail() + "!" + " It will be picked up on " + request.pickupDate() + " and delivered to " + issuedTo.getEmail() + "!");
        invoiceRepository.save(invoice);
        invoiceRepository.save(invoice2);

        return Map.of("success", true);
    }
}
