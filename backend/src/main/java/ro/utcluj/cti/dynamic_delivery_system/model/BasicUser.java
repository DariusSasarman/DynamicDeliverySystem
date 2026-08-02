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
    
    @Column(nullable = false, name = "phone_number")
    private String phoneNumber;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    public BasicUser(Long id, String name, String email, String password, String phoneNumber, LocalDateTime createdAt) {
        super(id, name, email, password, AccountTypes.BASIC, createdAt);
        this.phoneNumber = phoneNumber;
        this.schedule = new Schedule();
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }
}
