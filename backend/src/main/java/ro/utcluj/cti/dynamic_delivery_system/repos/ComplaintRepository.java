package ro.utcluj.cti.dynamic_delivery_system.repos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import ro.utcluj.cti.dynamic_delivery_system.model.BasicUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByFiledBy(BasicUser filedBy);
    List<Complaint> findByRegardingPackage(Package regardingPackage);
}