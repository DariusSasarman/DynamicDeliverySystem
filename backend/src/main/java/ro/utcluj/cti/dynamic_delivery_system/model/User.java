package ro.utcluj.cti.dynamic_delivery_system.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, name = "hashed_password")
    private String hashedPassword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "account_type")
    private AccountTypes accountType;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;


    protected User(Long id, String name, String email, String password, AccountTypes accountType, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.hashedPassword = password;
        this.accountType = accountType;
        this.createdAt = createdAt; 
    }

    public abstract String getRole();
    public abstract Location getLocation();
}
