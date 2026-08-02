package ro.utcluj.cti.dynamic_delivery_system.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.AuthResponse;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.DeliveryCreationRequest;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.ManagerCreationRequest;
import ro.utcluj.cti.dynamic_delivery_system.api.auth.AuthDtos.UserSummaryResponse;
import ro.utcluj.cti.dynamic_delivery_system.model.BasicUser;
import ro.utcluj.cti.dynamic_delivery_system.model.DeliveryUser;
import ro.utcluj.cti.dynamic_delivery_system.model.Location;
import ro.utcluj.cti.dynamic_delivery_system.model.Manager;
import ro.utcluj.cti.dynamic_delivery_system.model.User;
import ro.utcluj.cti.dynamic_delivery_system.repos.UserRepository;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse registerBasic(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        ensureEmailIsAvailable(normalizedEmail);

        LocalDateTime now = LocalDateTime.now();
        BasicUser user = new BasicUser(
                null,
                deriveDisplayName(normalizedEmail),
                normalizedEmail,
                passwordEncoder.encode(password),
                normalizedEmail,
                now);
        userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(user), user.getAccountType().name(), user.getEmail());
    }

    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getHashedPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return new AuthResponse(jwtService.generateToken(user), user.getAccountType().name(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public UserSummaryResponse currentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return new UserSummaryResponse(user.getEmail(), user.getName(), user.getAccountType().name());
    }

    public UserSummaryResponse createManager(String creatorEmail, ManagerCreationRequest request) {
        Manager creator = requireManager(creatorEmail);
        String normalizedEmail = normalizeEmail(request.email());
        ensureEmailIsAvailable(normalizedEmail);

        Location mainLocation = toLocation(request.mainLocation());
        Manager manager = new Manager(
                null,
                deriveDisplayName(normalizedEmail),
                normalizedEmail,
                passwordEncoder.encode(request.password()),
                creator,
                mainLocation,
                LocalDateTime.now());
        userRepository.save(manager);
        return summarize(manager);
    }

    public UserSummaryResponse createDelivery(String creatorEmail, DeliveryCreationRequest request) {
        Manager creator = requireManager(creatorEmail);
        Manager responsibleManager = userRepository.findByEmailIgnoreCase(normalizeEmail(request.responsibleManagerEmail()))
                .map(user -> {
                    if (user instanceof Manager manager) {
                        return manager;
                    }
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Responsible manager email must belong to a manager");
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Responsible manager not found"));

        String normalizedEmail = normalizeEmail(request.email());
        ensureEmailIsAvailable(normalizedEmail);

        DeliveryUser deliveryUser = new DeliveryUser(
                null,
                deriveDisplayName(normalizedEmail),
                normalizedEmail,
                passwordEncoder.encode(request.password()),
                Objects.requireNonNullElse(responsibleManager, creator),
                LocalDateTime.now());
        userRepository.save(deliveryUser);
        return summarize(deliveryUser);
    }

    @Transactional(readOnly = true)
    public UserSummaryResponse getSummaryByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .map(this::summarize)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private UserSummaryResponse summarize(User user) {
        return new UserSummaryResponse(user.getEmail(), user.getName(), user.getAccountType().name());
    }

    private Manager requireManager(String email) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Manager permissions required"));

        if (user instanceof Manager manager) {
            return manager;
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Manager permissions required");
    }

    private void ensureEmailIsAvailable(String email) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
    }

    private static String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String deriveDisplayName(String email) {
        int separatorIndex = email.indexOf('@');
        if (separatorIndex > 0) {
            return email.substring(0, separatorIndex);
        }
        return email;
    }

    private static Location toLocation(List<Double> mainLocation) {
        if (mainLocation == null || mainLocation.size() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Main location must contain latitude and longitude");
        }

        return new Location(mainLocation.get(0), mainLocation.get(1));
    }
}