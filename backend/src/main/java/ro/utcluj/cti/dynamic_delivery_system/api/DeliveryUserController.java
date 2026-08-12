package ro.utcluj.cti.dynamic_delivery_system.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import ro.utcluj.cti.dynamic_delivery_system.model.BasicUser;
import ro.utcluj.cti.dynamic_delivery_system.model.DeliveryUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Invoice;
import ro.utcluj.cti.dynamic_delivery_system.model.Location;
import ro.utcluj.cti.dynamic_delivery_system.model.PointOnMap;
import ro.utcluj.cti.dynamic_delivery_system.repos.InvoiceRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.PackageRepository;
import ro.utcluj.cti.dynamic_delivery_system.repos.UserRepository;
import ro.utcluj.cti.dynamic_delivery_system.model.Package;
import ro.utcluj.cti.dynamic_delivery_system.model.PackageStatus;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryUserController {
    
    private final PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    private record PackageDetails(
        String type,
        String status,
        String phoneNumber,
        Location coordinates,
        String availableFrom,
        String availableUntil) {
        public PackageDetails(String type, Package pkg, BasicUser targetUser) {
            this(
                type,
                pkg.getStatus().name(),
                targetUser.getPhoneNumber(),
                resolveCoordinates(type, pkg, targetUser),
                targetUser.getAvailableFrom(),
                targetUser.getAvailableUntil()
            );
        }

        private static Location resolveCoordinates(String type, Package pkg, BasicUser targetUser) {
            boolean pickupAssignment = "Pick-up".equals(type);
            Location resolved = pkg.getResolvedLocation(pickupAssignment);
            if (resolved != null) {
                return resolved;
            }
            if (targetUser.getSchedule() != null) {
                return targetUser.getSchedule().getAverageLocation();
            }
            return null;
        }
    }

    public record AssignmentSummary(Long id, String status, String assignmentType) {}

    @PostMapping("/nearest-package")
    @PreAuthorize("hasRole('DELIVERY')")
    public PointOnMap getNearestPackage(Authentication authentication,
                                        @RequestParam Double longitude,
                                        @RequestParam Double latitude) {
        DeliveryUser deliveryUser = getDeliveryUserFromAuthentication(authentication);
        deliveryUser.setLastKnownLocation( new Location(latitude, longitude));
        userRepository.save(deliveryUser);

        Package nearestPackage = packageRepository.findNearestPackageToDeliveryUser(deliveryUser)
                .orElse(null);

        if (nearestPackage == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No packages found for the delivery user");
        }

        return new PointOnMap(nearestPackage.getId(), nearestPackage.getLocation().getLongitude(), nearestPackage.getLocation().getLatitude()); 
    }

    @GetMapping("/get-pickup-assignments")
    @PreAuthorize("hasRole('DELIVERY')")
    @Transactional(readOnly = true)
    public List<AssignmentSummary> getPickupAssignments(Authentication authentication) {
        DeliveryUser deliveryUser = getDeliveryUserFromAuthentication(authentication);
        return packageRepository.findByPickUpBy(deliveryUser).stream()
                .filter(pkg -> pkg.getStatus() == PackageStatus.PENDING
                        || pkg.getStatus() == PackageStatus.PICKED_UP)
                .map(pkg -> new AssignmentSummary(pkg.getId(), pkg.getStatus().name(), "Pick-up"))
                .toList();
    }

    @GetMapping("/get-dropoff-assignments")
    @PreAuthorize("hasRole('DELIVERY')")
    @Transactional(readOnly = true)
    public List<AssignmentSummary> getDropoffAssignments(Authentication authentication) {
        DeliveryUser deliveryUser = getDeliveryUserFromAuthentication(authentication);
        return packageRepository.findByDeliveredBy(deliveryUser).stream()
                .filter(pkg -> pkg.getStatus() == PackageStatus.OUT_FOR_DELIVERY)
                .map(pkg -> new AssignmentSummary(pkg.getId(), pkg.getStatus().name(), "Drop-off"))
                .toList();
    }

    @GetMapping("/get-assigned-packages")
    @PreAuthorize("hasRole('DELIVERY')")
    public List<PointOnMap> getAssignedPackages(Authentication authentication) {
        DeliveryUser deliveryUser = getDeliveryUserFromAuthentication(authentication);
        List<Package> assignedPackages = packageRepository.findByPickUpBy(deliveryUser).stream()
                .filter(pkg -> pkg.getStatus() == PackageStatus.PENDING
                        || pkg.getStatus() == PackageStatus.PICKED_UP)
                .collect(Collectors.toCollection(ArrayList::new));
        assignedPackages.addAll(packageRepository.findByDeliveredBy(deliveryUser).stream()
                .filter(pkg -> pkg.getStatus() == PackageStatus.OUT_FOR_DELIVERY)
                .toList());
        return assignedPackages.stream()
            .map(pkg -> toPointOnMap(pkg))
            .filter(point -> point != null)
            .toList();
    }

    private PointOnMap toPointOnMap(Package pkg) {
        boolean pickupAssignment = pkg.getPickUpBy() != null
                && (pkg.getStatus() == PackageStatus.PENDING
                        || pkg.getStatus() == PackageStatus.PICKED_UP);
        Location location = pkg.getResolvedLocation(pickupAssignment);
        if (location == null) {
            return null;
        }
        return new PointOnMap(pkg.getId(), location.getLongitude(), location.getLatitude());
    }

    @PostMapping("/confirm-pickup")
    @PreAuthorize("hasRole('DELIVERY')")
    @Transactional
    public void confirmPickup(Authentication authentication, @RequestParam Long packageId) {
        DeliveryUser deliveryUser = getDeliveryUserFromAuthentication(authentication);
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        if (pkg.getPickUpBy() == null
                || !deliveryUser.getEmail().equalsIgnoreCase(pkg.getPickUpBy().getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Package is not assigned to the delivery user");
        }
        if (pkg.getStatus() != PackageStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Package is not awaiting pick-up");
        }

        pkg.hasBeenPickedUp(LocalDateTime.now());
        
        Invoice invoice = new Invoice(deliveryUser.getManager(), deliveryUser, "Please confirm the deposit at HQ of package with ID: " + pkg.getId());
        invoiceRepository.save(invoice);
        packageRepository.save(pkg);
    }

    @PostMapping("/confirm-deposit")
    @PreAuthorize("hasRole('DELIVERY')")
    @Transactional
    public void confirmDeposit(Authentication authentication, @RequestParam Long packageId) {
        DeliveryUser deliveryUser = getDeliveryUserFromAuthentication(authentication);
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        if (pkg.getPickUpBy() == null
                || !deliveryUser.getEmail().equalsIgnoreCase(pkg.getPickUpBy().getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Package is not assigned to the delivery user");
        }
        if (pkg.getStatus() != PackageStatus.PICKED_UP) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Package is not awaiting deposit");
        }

        pkg.arrivedAtDeposit(LocalDateTime.now());
        packageRepository.save(pkg);
    }

    @GetMapping("/get-package-details")
    @PreAuthorize("hasRole('DELIVERY')")
    @Transactional
    public PackageDetails getPackageDetails(Authentication authentication, @RequestParam Long packageId) {
        DeliveryUser deliveryUser = getDeliveryUserFromAuthentication(authentication);
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));
        
        boolean isDelivery = pkg.getDeliveredBy() != null && deliveryUser.getEmail().equalsIgnoreCase(pkg.getDeliveredBy().getEmail());
        boolean isPickup = pkg.getPickUpBy() != null && deliveryUser.getEmail().equalsIgnoreCase(pkg.getPickUpBy().getEmail());

        if (!isDelivery && !isPickup) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Package is not assigned to the delivery user");
        }

        String type = isDelivery ? "Drop-off" : "Pick-up";
        BasicUser targetUser = isDelivery ? pkg.getIssuedTo() : pkg.getIssuedBy();
        if(targetUser == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Target user not found for the package");
        }

        return new PackageDetails(type, pkg, targetUser);
    }

    @GetMapping("/get-delivery-code")
    @PreAuthorize("hasRole('DELIVERY')")
    @Transactional
    public String getDeliveryCode(Authentication authentication, @RequestParam Long packageId) {
        DeliveryUser deliveryUser = getDeliveryUserFromAuthentication(authentication);
        Package pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));
        

        if (pkg.getDeliveredBy() == null || !deliveryUser.getEmail().equalsIgnoreCase(pkg.getDeliveredBy().getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Package is not assigned to the delivery user");
        }

        return pkg.getConfirmationCode();
    }

    private DeliveryUser getDeliveryUserFromAuthentication(Authentication authentication) {
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .filter(DeliveryUser.class::isInstance)
                .map(DeliveryUser.class::cast)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    
}