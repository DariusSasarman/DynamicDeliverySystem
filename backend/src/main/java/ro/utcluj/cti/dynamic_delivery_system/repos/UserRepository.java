package ro.utcluj.cti.dynamic_delivery_system.repos;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ro.utcluj.cti.dynamic_delivery_system.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}