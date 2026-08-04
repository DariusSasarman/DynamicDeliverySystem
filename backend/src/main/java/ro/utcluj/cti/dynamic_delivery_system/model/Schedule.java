package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Schedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "schedule_id")
    private List<Entry> scheduleEntries = new ArrayList<>();

    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt = LocalDateTime.now();

    public void addEntry(Entry entry) {
        validateEntry(entry);
        scheduleEntries.add(entry);
        lastModifiedAt = LocalDateTime.now();
    }

    private void validateEntry(Entry entry) {
        if (entry == null) {
            throw new IllegalArgumentException("Entry cannot be null");
        }

        if (entry.getFrom() >= entry.getTo()) {
            throw new IllegalArgumentException("Entry start time must be before end time");
        }

        for (Entry existingEntry : scheduleEntries) {
            if (entriesOverlap(existingEntry, entry)) {
                throw new IllegalArgumentException("Schedule entries cannot overlap");
            }
        }
    }

    private static boolean entriesOverlap(Entry firstEntry, Entry secondEntry) {
        if (Collections.disjoint(firstEntry.getValidDays(), secondEntry.getValidDays())) {
            return false;
        }

        return firstEntry.getFrom() < secondEntry.getTo() && secondEntry.getFrom() < firstEntry.getTo();
    }

    public Location getAverageLocation()
    {
        if(scheduleEntries.isEmpty()) {
            return null;
        }
        
        double latitude = 0.0;
        double longitude = 0.0;
        double count = 0.0;
        for (Entry entry : scheduleEntries) {
            latitude += entry.getLocation().getLatitude();
            longitude += entry.getLocation().getLongitude();
            count++;
        }
        return new Location(latitude / count, longitude / count);
    }
}
