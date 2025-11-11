package ro.baskitup.application.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ro.baskitup.adapters.persistence.UserEntity;
import ro.baskitup.adapters.persistence.UserRepository;
import ro.baskitup.config.JwtTokenService;
import ro.baskitup.domain.model.UserRole;
import ro.baskitup.domain.view.UserView;

import java.util.Optional;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenService jwt;

  public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtTokenService jwt) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.jwt = jwt;
  }

  public AuthResponse register(RegisterRequest request) {
    String normalizedEmail = request.email().trim().toLowerCase();
    Optional<UserEntity> existing = users.findByEmail(normalizedEmail);
    if (existing.isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }
    UserEntity user = new UserEntity();
    user.setEmail(normalizedEmail);
    user.setName(request.name());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setRole(UserRole.CUSTOMER);
    users.save(user);
    return buildResponse(user);
  }

  public AuthResponse login(LoginRequest request) {
    String normalizedEmail = request.email().trim().toLowerCase();
    UserEntity user = users.findByEmail(normalizedEmail)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    return buildResponse(user);
  }

  public UserView toView(UserEntity user) {
    return new UserView(user.getId(), user.getEmail(), user.getName(), user.getRole());
  }

  private AuthResponse buildResponse(UserEntity user) {
    String token = jwt.generateToken(user);
    return new AuthResponse(token, toView(user));
  }

  public record LoginRequest(String email, String password) {}
  public record RegisterRequest(String name, String email, String password) {}
  public record AuthResponse(String token, UserView user) {}
}
