package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Manager extends User {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "made_by_id")
    private Manager madeBy;

    @Embedded
    private Location managingLocation;

    public Manager(Long id, String name, String email, String password, Manager madeBy, Location managingLocation, LocalDateTime createdAt) {
        super(id, name, email, password, AccountTypes.MANAGER, createdAt);
        this.madeBy = madeBy;
        this.managingLocation = managingLocation;
    }

}
