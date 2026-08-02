package ro.utcluj.cti.dynamic_delivery_system.repos;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ro.utcluj.cti.dynamic_delivery_system.model.Package;

public interface PackageRepository extends JpaRepository<Package, Long> {
    Optional<Package> findById(Long id);
    
    List<Package> findByIssuedToEmail(String email);
}
