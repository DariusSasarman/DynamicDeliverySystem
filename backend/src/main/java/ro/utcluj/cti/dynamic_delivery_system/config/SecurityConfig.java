package ro.utcluj.cti.dynamic_delivery_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/", "/index.html", "/error", "/assets/**", "/**/*.js", "/**/*.css", "/**/*.ico", "/**/*.png", "/**/*.svg", "/api/auth/login", "/api/auth/register").permitAll()
                    .requestMatchers("/actuator/health").permitAll()
                    .requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/api/auth/manager", "/api/auth/delivery").hasRole("MANAGER")
                        .requestMatchers("/api/basic/**").hasRole("BASIC")
                        .requestMatchers("/api/delivery/**").hasRole("DELIVERY")
                        .requestMatchers("/api/manager/**").hasRole("MANAGER")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}