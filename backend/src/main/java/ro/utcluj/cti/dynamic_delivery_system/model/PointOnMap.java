package ro.utcluj.cti.dynamic_delivery_system.model;

public record PointOnMap(
        Long id,
        Double[] pos
) {
    public PointOnMap(Long id, Double longitude, Double latitude) {
        this(id, new Double[]{latitude, longitude});
    }
}