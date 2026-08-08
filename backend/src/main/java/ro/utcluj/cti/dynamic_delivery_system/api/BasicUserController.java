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
import java.util.List;
import java.util.Optional;

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
import ro.utcluj.cti.dynamic_delivery_system.model.PointOnMap;

@RestController
@RequestMapping("/api/basic")
@RequiredArgsConstructor
public class BasicUserController {

    private final PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    private final ComplaintRepository complaintRepository;


    @GetMapping("/package-client-list")
    public List<PointOnMap> getPackageClientList(Authentication authentication) {
        return packageRepository.findByIssuedToEmail(authentication.getName())
                .stream()
                .filter(pkg -> pkg.getStatus().equals(PackageStatus.OUT_FOR_DELIVERY))
                .filter(pkg -> pkg.getDeliveredBy() != null && pkg.getDeliveredBy().getLastKnownLocation() != null)
                .map(pkg -> new PointOnMap(
                        pkg.getId(),
                        pkg.getDeliveredBy().getLastKnownLocation().getLongitude(),
                        pkg.getDeliveredBy().getLastKnownLocation().getLatitude()))
                .toList();
    }

    @GetMapping("/delivered-package-client-list")
    public List<Long> getDeliveredPackageClientList(Authentication authentication) {
        return packageRepository.findByIssuedToEmail(authentication.getName())
                .stream()
                .filter(pkg -> pkg.getStatus().equals(PackageStatus.DELIVERED))
                .filter(pkg -> pkg.getDeliveredBy() != null)
                .map(pkg -> pkg.getId())
                .toList();
    }

    public record DeliveryConfirmationRequest(
            Long packageId,
            String deliveryCode) {
    }

    public record ConfirmationResponse(
            boolean confirmation) {
    }

    @PostMapping("/delivery-confirmation")
    public ConfirmationResponse getDeliveryConfirmation(
            Authentication authentication,
            @RequestBody DeliveryConfirmationRequest request) {

        boolean valid = packageRepository.findByIssuedToEmail(authentication.getName())
                .stream()
                .anyMatch(pkg -> pkg.getId().equals(request.packageId()) &&
                        pkg.getStatus().equals(PackageStatus.OUT_FOR_DELIVERY) &&
                        pkg.getConfirmationCode().equals(request.deliveryCode()));

        if (valid) {
            packageRepository.findById(request.packageId()).ifPresent(pkg -> {
                pkg.hasBeenDelivered(java.time.LocalDateTime.now());
                packageRepository.save(pkg);
            });
        }

        return new ConfirmationResponse(valid);
    }

    public record PickupRequest(
            LocalDateTime pickUpDate,
            String receiverEmail) {
    }
    
    @PostMapping("/pickup-request")
    @Transactional
    public ConfirmationResponse sendPickupRequest(
            Authentication authentication,
            @RequestBody PickupRequest request) {
        
        if(request.pickUpDate() == null || request.receiverEmail() == null || request.receiverEmail().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request data");
        }

        if(request.pickUpDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pick-up date cannot be in the past");
        }

        if(request.receiverEmail().equalsIgnoreCase(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot send a package to yourself");
        }
        
        BasicUser issuedBy = findBasicUserByEmail(authentication.getName());
        BasicUser issuedTo = findBasicUserByEmail(request.receiverEmail());

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

        return new ConfirmationResponse(true);
    }


    @GetMapping("/get-schedule")
    @Transactional
    public ScheduleSummary getSchedule(Authentication authentication) {
        BasicUser user = findBasicUserByEmail(authentication.getName());
        if(user.getSchedule() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Schedule not found");
        }
        return user.getSchedule().toSummary(user.getPhoneNumber());
    }

    @PostMapping("/save-schedule")
    @Transactional
    public ConfirmationResponse saveSchedule(Authentication authentication, @RequestBody ScheduleSummary scheduleSummary) {
        String email = authentication.getName();

        BasicUser user = findBasicUserByEmail(email);

        user.setSchedule(scheduleSummary.toSchedule());
        userRepository.save(user);


        packageRepository.findByIssuedToEmail(email)
                .stream()
                .filter(pkg -> pkg.getStatus().equals(PackageStatus.OUT_FOR_DELIVERY))
                .forEach(pkg -> {
                    Invoice invoice = new Invoice(pkg.getManagedBy(), pkg.getDeliveredBy(), "The recipient has updated their schedule. Please check the new schedule for delivery.");
                    invoiceRepository.save(invoice);
                });
                
        packageRepository.findByIssuedByEmail(email)
                .stream()
                .filter(pkg -> pkg.getStatus().equals(PackageStatus.PENDING))
                .forEach(pkg -> {
                    Invoice invoice = new Invoice(pkg.getManagedBy(), pkg.getDeliveredBy(), "The sender has updated their schedule. Please check the new schedule for pick-up.");
                    invoiceRepository.save(invoice);
                });
        return new ConfirmationResponse(true);
    }

    private record ComplaintInitiationRequest(Long deliveryID, String text) {
    }

    @PostMapping("/send-complaint")
    @Transactional
    public ConfirmationResponse sendComplaint(Authentication authentication, @RequestBody ComplaintInitiationRequest request) {
        String email = authentication.getName();

        Long deliveryID = request.deliveryID();
        if(deliveryID == null || deliveryID <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid delivery ID");
        }

        String text = request.text();
        if(text == null || text.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Complaint text cannot be empty");
        }

        BasicUser user = findBasicUserByEmail(email);

        Package pkg = packageRepository.findById(deliveryID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        if(pkg.getIssuedTo() == null || !pkg.getIssuedTo().getEmail().equalsIgnoreCase(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can only file complaints for packages issued to you");
        }

        Complaint complaint = new Complaint(user,pkg, text);
        complaintRepository.save(complaint);

        return new ConfirmationResponse(true);
    }

    private BasicUser findBasicUserByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (!(user instanceof BasicUser basicUser)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user type");
        }
        return basicUser;
    }
}