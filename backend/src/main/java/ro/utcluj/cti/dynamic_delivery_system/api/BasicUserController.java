package ro.utcluj.cti.dynamic_delivery_system.api;

import ro.utcluj.cti.dynamic_delivery_system.model.BasicUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Complaint;
import ro.utcluj.cti.dynamic_delivery_system.model.Invoice;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.model.Package;
import ro.utcluj.cti.dynamic_delivery_system.model.PackageStatus;
import ro.utcluj.cti.dynamic_delivery_system.model.Schedule.ScheduleSummary;
import ro.utcluj.cti.dynamic_delivery_system.model.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ro.utcluj.cti.dynamic_delivery_system.repos.InvoiceRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.PackageRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.ComplaintRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.UserRepository;

@RestController
@RequestMapping("/api/basic")
@RequiredArgsConstructor
public class BasicUserController {

    private final PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    private final ComplaintRepository complaintRepository;

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
            LocalDateTime pickUpDate,
            String receiverEmail) {
    }
    
    @PostMapping("/pickup-request")
    @Transactional
    public Map<String, Boolean> sendPickupRequest(
            Authentication authentication,
            @RequestBody PickupRequest request) {
        String email = authentication.getName();
        
        if(email.equalsIgnoreCase(request.receiverEmail()) || request.pickUpDate().isBefore(LocalDateTime.now())) {
            
            throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Invalid pickup request" );
            
        }

        Optional<User> issuedByRetrieval = userRepository.findByEmailIgnoreCase(email);
        if(issuedByRetrieval.isEmpty()) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "User not found" );
        }

        if(!(issuedByRetrieval.get() instanceof BasicUser issuedBy)) {
            throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Invalid user type" );
        }

        Optional<User> issuedToRetrieval = userRepository.findByEmailIgnoreCase(request.receiverEmail());
        if(issuedToRetrieval.isEmpty()) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "User not found" );
        }
        if(!(issuedToRetrieval.get() instanceof BasicUser issuedTo)) {
            throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Invalid user type" );
        }

        if(issuedBy.getSchedule() == null || issuedBy.getSchedule().getAverageLocation() == null) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "Schedule not found" );
        }

        Optional<Manager> manager = userRepository.findNearestManagerByLocation(issuedBy.getSchedule().getAverageLocation().getLongitude(), issuedBy.getSchedule().getAverageLocation().getLatitude());
        if(manager.isEmpty()) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "No nearby manager found" );
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
        Invoice invoice2 = new Invoice(nearestManager, issuedBy, "You sent a package to " + issuedTo.getEmail() + "!" + " It will be picked up on " + request.pickUpDate() + " and delivered to " + issuedTo.getEmail() + "!");
        invoiceRepository.save(invoice);
        invoiceRepository.save(invoice2);

        return Map.of("success", true);
    }


    @GetMapping("/get-schedule")
    @Transactional
    public ScheduleSummary getSchedule(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userRetrieval = userRepository.findByEmailIgnoreCase(email);
        if(userRetrieval.isEmpty()) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "User not found" );
        }
        if(!(userRetrieval.get() instanceof BasicUser user)) {
            throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Invalid user type" );
        }
        if(user.getSchedule() == null) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "Schedule not found" );
        }
        return user.getSchedule().toSummary(email);
    }

    @PostMapping("/save-schedule")
    @Transactional
    public Map<String, Boolean> saveSchedule(Authentication authentication, @RequestBody ScheduleSummary scheduleSummary) {
        String email = authentication.getName();
        Optional<User> userRetrieval = userRepository.findByEmailIgnoreCase(email);
        if(userRetrieval.isEmpty()) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "User not found" );
        }
        if(!(userRetrieval.get() instanceof BasicUser user)) {
            throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Invalid user type" );
        }
        if(user.getSchedule() == null) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "Schedule not found" );
        }

        user.setSchedule(scheduleSummary.toSchedule());
        userRepository.save(user);
        return Map.of("success", true);
    }

    @PostMapping("/send-complaint")
    @Transactional
    public Map<String, Boolean> sendComplaint(Authentication authentication, @RequestBody Map<String, String> request) {
        String email = authentication.getName();
        Long deliveryID = Long.parseLong(request.get("deliveryID"));
        String text = request.get("text");

        Optional<User> userRetrieval = userRepository.findByEmailIgnoreCase(email);
        if(userRetrieval.isEmpty()) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "User not found" );   
        }

        if(!(userRetrieval.get() instanceof BasicUser user)) {
            throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Invalid user type" );
        }

        Optional<Package> packageRetrieval = packageRepository.findById(deliveryID);
        if(packageRetrieval.isEmpty()) {
            throw new ResponseStatusException( HttpStatus.NOT_FOUND, "Package not found" );
        }

        Package pkg = packageRetrieval.get();
        if(!pkg.getIssuedTo().getEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "You are not the recipient of this package" );
        }

        Complaint complaint = new Complaint(user,pkg, text);
        complaintRepository.save(complaint);

        return Map.of("success", true);
    }
}