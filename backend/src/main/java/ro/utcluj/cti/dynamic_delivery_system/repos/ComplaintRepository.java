
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByFiledBy(BasicUser filedBy);
    List<Complaint> findByRegardingPackage(Package regardingPackage);
}