package ro.baskitup.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  @Bean
  SecurityFilterChain api(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable());
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/**", "/h2-console/**").permitAll()
        .anyRequest().permitAll()
    );
    http.headers(h -> h.frameOptions(f -> f.sameOrigin()));
    return http.build();
  }
}