package ro.utcluj.cti.dynamic_delivery_system.repos;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.model.User;
import ro.utcluj.cti.dynamic_delivery_system.model.DeliveryUser;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    Optional<Manager> findNearestManagerByLocation(Double longitude, Double latitude);

    List<DeliveryUser> findByManager(Manager manager);
}