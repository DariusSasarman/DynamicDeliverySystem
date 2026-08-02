package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DeliveryUser extends User {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "made_by_id")
    private Manager madeBy;

    public DeliveryUser(Long id, String name, String email, String password, Manager madeBy, LocalDateTime createdAt) {
        super(id, name, email, password, AccountTypes.DELIVERY, createdAt);
        this.madeBy = madeBy;
    }

}
