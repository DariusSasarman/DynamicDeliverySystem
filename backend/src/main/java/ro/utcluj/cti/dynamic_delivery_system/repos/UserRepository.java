package ro.utcluj.cti.dynamic_delivery_system.repos;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import ro.utcluj.cti.dynamic_delivery_system.model.DeliveryUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Location;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<DeliveryUser> findByManager(Manager manager);

    default Optional<Manager> findNearestManagerByLocation(Double longitude, Double latitude) {
        if (longitude == null || latitude == null) {
            return Optional.empty();
        }

        Location target = new Location(latitude, longitude);
        return findAll().stream()
                .filter(Manager.class::isInstance)
                .map(Manager.class::cast)
                .filter(manager -> manager.getManagingLocation() != null)
                .min(Comparator.comparingDouble(
                        manager -> manager.getManagingLocation().distanceTo(target)));
    }
}
