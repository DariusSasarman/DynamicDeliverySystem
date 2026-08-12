package ro.utcluj.cti.dynamic_delivery_system.repos;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import ro.utcluj.cti.dynamic_delivery_system.model.DeliveryUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Location;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.model.Package;
import ro.utcluj.cti.dynamic_delivery_system.model.PackageStatus;

public interface PackageRepository extends JpaRepository<Package, Long> {
    Optional<Package> findById(Long id);
    
    List<Package> findByIssuedToEmail(String email);
    List<Package> findByDeliveredByEmail(String email);
    List<Package> findByIssuedByEmail(String email);
    List<Package> findByManagedBy(Manager manager);
    List<Package> findByPickUpBy(DeliveryUser deliveryUser);
    List<Package> findByDeliveredBy(DeliveryUser deliveryUser);

    default Optional<Package> findNearestPackageToDeliveryUser(DeliveryUser deliveryUser)
    {
        Location userLocation = deliveryUser.getLastKnownLocation();
        if (userLocation == null) {
            return Optional.empty();
        }
        
        List<Package> packages = new ArrayList<>();
        packages.addAll(findByPickUpBy(deliveryUser).stream()
                .filter(pkg -> pkg.getStatus() == PackageStatus.PENDING
                        || pkg.getStatus() == PackageStatus.PICKED_UP)
                .toList());
        
        packages.addAll(findByDeliveredBy(deliveryUser).stream()
                .filter(pkg -> pkg.getStatus() == PackageStatus.OUT_FOR_DELIVERY)
                .toList());

        if (packages.isEmpty()) {
            return Optional.empty();
        }

        return packages.stream()
                .filter(pkg -> pkg.getLocation() != null)
                .min(Comparator.comparingDouble(pkg -> pkg.getLocation().distanceTo(userLocation)));
    }
}
