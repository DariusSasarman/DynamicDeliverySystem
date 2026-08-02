package ro.utcluj.cti.dynamic_delivery_system.api.auth;

import java.util.List;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record Credentials(String email, String password) {
    }

    public record ManagerCreationRequest(String email, String password, List<Double> mainLocation) {
    }

    public record DeliveryCreationRequest(String email, String password, String responsibleManagerEmail) {
    }

    public record AuthResponse(String token, String accountType, String email) {
    }

    public record UserSummaryResponse(String email, String name, String accountType) {
    }
}