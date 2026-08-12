package ro.utcluj.cti.dynamic_delivery_system.api.auth;

import java.security.Principal;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.AuthResponse;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.Credentials;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.DeliveryCreationRequest;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.ManagerCreationRequest;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.UserSummaryResponse;
import ro.utcluj.cti.dynamic_delivery_system.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody Credentials credentials) {
        return authService.registerBasic(credentials.email(), credentials.password());
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody Credentials credentials) {
        return authService.login(credentials.email(), credentials.password());
    }

    @GetMapping("/me")
    public UserSummaryResponse me(Principal principal) {
        return authService.getSummaryByEmail(principal.getName());
    }

    @PostMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public UserSummaryResponse createManager(Authentication authentication, @RequestBody ManagerCreationRequest request) {
        return authService.createManager(authentication.getName(), request);
    }

    @PostMapping("/delivery")
    @PreAuthorize("hasRole('MANAGER')")
    public UserSummaryResponse createDelivery(Authentication authentication, @RequestBody DeliveryCreationRequest request) {
        return authService.createDelivery(authentication.getName(), request);
    }
}