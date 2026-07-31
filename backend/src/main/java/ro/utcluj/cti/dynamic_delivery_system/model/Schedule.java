package ro.utcluj.cti.dynamic_delivery_system.model;

import java.time.LocalDateTime;
import java.util.ArrayList;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

public class Schedule {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Id
    // Foreign key to the User entity
    private Long userId;
    
    private LocalDateTime lastModified;

    private ArrayList<Entry> entries;

    public Schedule(Long userId) {
        this.userId = userId;
        this.lastModified = LocalDateTime.now();
        this.entries = new ArrayList<>();
    }


}
