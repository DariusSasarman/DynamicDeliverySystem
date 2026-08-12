package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BasicUser extends User {
    
    @Column(name = "phone_number")
    private String phoneNumber;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    public BasicUser(Long id, String name, String email, String password, String phoneNumber, LocalDateTime createdAt) {
        super(id, name, email, password, AccountTypes.BASIC, createdAt);
        this.phoneNumber = phoneNumber;
        this.schedule = new Schedule();
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    @Override
    public String getRole() {
        return "BASIC";
    }

    @Override
    public Location getLocation() {
        return schedule.getLocation();
    }

    public String getAvailableFrom() {
        Integer from = schedule.getAvailableFrom();
        return from != null ? from + ":00" : "N/A";
    }

    public String getAvailableUntil() {
        Integer until = schedule.getAvailableUntil();
        return until != null ? until + ":00" : "N/A";
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof BasicUser)) return false;
        BasicUser other = (BasicUser) obj;
        return this.getId().equals(other.getId());
    }
}
