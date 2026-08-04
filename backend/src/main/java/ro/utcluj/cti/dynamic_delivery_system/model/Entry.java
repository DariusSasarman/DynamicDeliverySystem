package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.DayOfWeek;
import java.util.Collection;
import java.util.EnumSet;
import java.util.Set;

@Entity
@Table(name = "schedule_entries")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Entry {

    public record EntrySummary(int from, int until, List<String> days, List<Double> position) {
        public Entry toEntry() {
            Location location = new Location(position.get(0), position.get(1));
            Set<DayOfWeek> validDays = EnumSet.noneOf(DayOfWeek.class);
            
            for (String day : days) {
                validDays.add(parseDay(day.toUpperCase()));
            }
            return new Entry(from, until, validDays, location);
        }
        private static DayOfWeek parseDay(String day) {
            return switch (day.toUpperCase()) {
                case "MON" -> DayOfWeek.MONDAY;
                case "TUE" -> DayOfWeek.TUESDAY;
                case "WED" -> DayOfWeek.WEDNESDAY;
                case "THU" -> DayOfWeek.THURSDAY;
                case "FRI" -> DayOfWeek.FRIDAY;
                case "SAT" -> DayOfWeek.SATURDAY;
                case "SUN" -> DayOfWeek.SUNDAY;
                default -> throw new IllegalArgumentException("Invalid day: " + day);
            };
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_hour", nullable = false)
    private int from;

    @Column(name = "to_hour", nullable = false)
    private int to;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "entry_valid_days", joinColumns = @JoinColumn(name = "entry_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private Set<DayOfWeek> validDays = EnumSet.noneOf(DayOfWeek.class);

    @Embedded
    private Location location;

    public Entry(int from, int to, boolean[] validDays, Location location) {
        this.from = from;
        this.to = to;
        this.location = location;
        this.validDays = convertValidDays(validDays);
    }

    public Entry(int from, int to, Collection<DayOfWeek> validDays, Location location) {
        this.from = from;
        this.to = to;
        this.location = location;
        this.validDays = copyValidDays(validDays);
    }

    private static Set<DayOfWeek> convertValidDays(boolean[] validDays) {
        if (validDays == null) {
            return EnumSet.noneOf(DayOfWeek.class);
        }

        Set<DayOfWeek> days = EnumSet.noneOf(DayOfWeek.class);
        DayOfWeek[] allDays = DayOfWeek.values();

        for (int index = 0; index < validDays.length && index < allDays.length; index++) {
            if (validDays[index]) {
                days.add(allDays[index]);
            }
        }

        return days;
    }

    private static Set<DayOfWeek> copyValidDays(Collection<DayOfWeek> validDays) {
        if (validDays == null || validDays.isEmpty()) {
            return EnumSet.noneOf(DayOfWeek.class);
        }

        return EnumSet.copyOf(validDays);
    }

    public EntrySummary toSummary() {
        return new EntrySummary(
            from,
            to, 
            validDays.stream()
                .map(DayOfWeek::name)
                .map(s -> s.substring(0, Math.min(s.length(), 3)))
                .toList(), 
            new ArrayList<>(
                List.of(
                    location.getLatitude(), 
                    location.getLongitude()
                )
            )
        );
    }

}
