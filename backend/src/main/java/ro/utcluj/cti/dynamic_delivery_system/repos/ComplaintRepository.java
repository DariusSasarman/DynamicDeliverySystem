package ro.utcluj.cti.dynamic_delivery_system.repos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import ro.utcluj.cti.dynamic_delivery_system.model.BasicUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Complaint;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.model.Package;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByFiledBy(BasicUser filedBy);

    List<Complaint> findByRegardingPackage(Package regardingPackage);

    default List<Complaint> findByRegardingPackageManagedBy(Manager manager) {
        return findAll().stream()
                .filter(complaint -> {
                    Package pkg = complaint.getRegardingPackage();
                    return pkg != null
                            && pkg.getManagedBy() != null
                            && pkg.getManagedBy().equals(manager);
                })
                .toList();
    }
}
