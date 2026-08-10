package ro.utcluj.cti.dynamic_delivery_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(
    scanBasePackages = "ro.utcluj.cti.dynamic_delivery_system"
)
@EnableJpaRepositories(
    basePackages = "ro.utcluj.cti.dynamic_delivery_system.repos"
)
@org.springframework.boot.persistence.autoconfigure.EntityScan(
    basePackages = "ro.utcluj.cti.dynamic_delivery_system.model"
)
public class DynamicDeliverySystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(
            DynamicDeliverySystemApplication.class,
            args
        );
    }
}