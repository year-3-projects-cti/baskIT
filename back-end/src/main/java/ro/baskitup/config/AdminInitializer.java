package ro.baskitup.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import ro.baskitup.adapters.persistence.UserEntity;
import ro.baskitup.adapters.persistence.UserRepository;
import ro.baskitup.domain.model.UserRole;

@Component
public class AdminInitializer implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

  private final UserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final String adminEmail;
  private final String adminPassword;

  public AdminInitializer(
      UserRepository users,
      PasswordEncoder passwordEncoder,
      @Value("${app.admin.email}") String adminEmail,
      @Value("${app.admin.password}") String adminPassword
  ) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.adminEmail = adminEmail;
    this.adminPassword = adminPassword;
  }

  @Override
  public void run(ApplicationArguments args) {
    users.findByEmail(adminEmail.toLowerCase()).ifPresentOrElse(
        user -> log.info("Admin user already exists with email {}", user.getEmail()),
        () -> {
          UserEntity user = new UserEntity();
          user.setEmail(adminEmail.toLowerCase());
          user.setName("Root Admin");
          user.setPasswordHash(passwordEncoder.encode(adminPassword));
          user.setRole(UserRole.ADMIN);
          users.save(user);
          log.warn("Seeded default admin account. EMAIL={} PASSWORD={} (change after login)", adminEmail, adminPassword);
        }
    );
  }
}
