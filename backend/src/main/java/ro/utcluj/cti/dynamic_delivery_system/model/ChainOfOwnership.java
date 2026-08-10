package ro.utcluj.cti.dynamic_delivery_system.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chain_of_ownership")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChainOfOwnership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "package_id", nullable = false)
    private Package pkg;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public ChainOfOwnership(
            Package pkg,
            User owner,
            LocalDateTime timestamp
    ) {
        this.pkg = pkg;
        this.owner = owner;
        this.timestamp = timestamp;
    }
}