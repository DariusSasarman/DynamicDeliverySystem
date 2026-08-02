package ro.utcluj.cti.dynamic_delivery_system.api;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ro.utcluj.cti.dynamic_delivery_system.repos.PackageRepository;
import ro.utcluj.cti.dynamic_delivery_system.service.JwtService;

@RestController
@RequestMapping("/api/basic")
@RequiredArgsConstructor
public class BasicUserController {

    private final PackageRepository packageRepository;

    private class PointOnMap{
        public Long id;
        public Double pos[];

        public PointOnMap(Long id, Double longitude, Double latitude) {
            this.id = id;
            this.pos = new Double[]{longitude, latitude};
        }
    }
    
    @GetMapping("/package-client-list")
    public List<PointOnMap> getPackageClientList(Authentication authentication) {
        String email = authentication.getName();
        List<PointOnMap> points = new ArrayList<>();
        packageRepository.findByIssuedToEmail(email).forEach(pkg -> {
            if (pkg.getDeliveredBy() != null && pkg.getDeliveredBy().getLastKnownLocation() != null) {
                points.add(new PointOnMap(
                    pkg.getId(),
                    pkg.getDeliveredBy().getLastKnownLocation().getLongitude(),
                    pkg.getDeliveredBy().getLastKnownLocation().getLatitude()));
            }
        });
        return points;
    }
}
