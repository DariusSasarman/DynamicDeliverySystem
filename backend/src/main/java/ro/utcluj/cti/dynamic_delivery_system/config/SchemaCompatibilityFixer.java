package ro.utcluj.cti.dynamic_delivery_system.config;

import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(0)
public class SchemaCompatibilityFixer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SchemaCompatibilityFixer.class);

    private final EntityManager entityManager;

    public SchemaCompatibilityFixer(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        relaxBasicUserOnlyColumns();
    }

    private void relaxBasicUserOnlyColumns() {
        // SINGLE_TABLE inheritance shares app_users across user types; BasicUser-only
        // columns must be nullable so Manager/DeliveryUser rows can be inserted.
        try {
            entityManager
                    .createNativeQuery("ALTER TABLE app_users MODIFY phone_number VARCHAR(255) NULL")
                    .executeUpdate();
        } catch (RuntimeException exception) {
            log.debug("phone_number column alter skipped: {}", exception.getMessage());
        }

        try {
            entityManager
                    .createNativeQuery("ALTER TABLE app_users MODIFY schedule_id BIGINT NULL")
                    .executeUpdate();
        } catch (RuntimeException exception) {
            log.debug("schedule_id column alter skipped: {}", exception.getMessage());
        }
    }
}
