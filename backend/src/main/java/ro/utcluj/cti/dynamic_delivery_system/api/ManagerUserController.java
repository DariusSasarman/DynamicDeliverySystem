package ro.utcluj.cti.dynamic_delivery_system.api;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ro.utcluj.cti.dynamic_delivery_system.model.DeliveryUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Location;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.repos.UserRepository;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerUserController {
    
    private UserRepository userRepository;

    public record CourierLocation(String email, Location pos) {
        public CourierLocation(DeliveryUser courier) {
            this(courier.getEmail(), courier.getLocation());
        }
    }

    @GetMapping("/get-assigned-couriers")
    @PreAuthorize("hasRole('MANAGER')")
    public List<CourierLocation> getAssignedCouriers(Authentication authentication) {
        String managerEmail = authentication.getName();
        return userRepository.findByEmailIgnoreCase(managerEmail)
                .filter(user -> user instanceof Manager)
                .map(user -> (Manager) user)
                .map(manager -> userRepository.findByManager(manager))
                .orElse(Collections.emptyList())
                .stream()
                .map(CourierLocation::new)
                .collect(Collectors.toList());
    }
}
