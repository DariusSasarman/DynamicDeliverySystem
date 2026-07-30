package ro.utcluj.cti.dynamic_delivery_system.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "ro.utcluj.cti.dynamic_delivery_system")
public class DynamicDeliverySystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(DynamicDeliverySystemApplication.class, args);
	}

}
