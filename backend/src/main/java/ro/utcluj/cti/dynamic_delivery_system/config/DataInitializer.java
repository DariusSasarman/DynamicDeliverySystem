package ro.utcluj.cti.dynamic_delivery_system.config;

import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ro.utcluj.cti.dynamic_delivery_system.model.Location;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.repos.UserRepository;

@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private static final String SEED_MANAGER_EMAIL = "manager@delivery.local";
    private static final String SEED_MANAGER_PASSWORD = "Manager123!";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        boolean managerExists = userRepository.findAll().stream().anyMatch(Manager.class::isInstance);
        if (managerExists) {
            return;
        }

        Manager rootManager = new Manager(
                null,
                "root-manager",
                SEED_MANAGER_EMAIL,
                passwordEncoder.encode(SEED_MANAGER_PASSWORD),
                null,
                new Location(46.7712, 23.6236),
                LocalDateTime.now());
        userRepository.save(rootManager);
        log.info("Seeded root manager account: {} / {}", SEED_MANAGER_EMAIL, SEED_MANAGER_PASSWORD);
    }
}
