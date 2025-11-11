package ro.baskitup.adapters.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.baskitup.application.services.AuthService;
import ro.baskitup.application.services.AuthService.AuthResponse;
import ro.baskitup.config.JwtAuthenticationFilter.SecuredUser;
import ro.baskitup.domain.view.UserView;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterDto request) {
    return authService.register(new AuthService.RegisterRequest(request.name(), request.email(), request.password()));
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginDto request) {
    return authService.login(new AuthService.LoginRequest(request.email(), request.password()));
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout() {
    // Stateless JWT - client discards token. Endpoint kept for symmetry.
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/me")
  public UserView me(@AuthenticationPrincipal SecuredUser user) {
    return new UserView(user.id(), user.email(), user.name(), user.role());
  }

  public record RegisterDto(
      @NotBlank @Size(min = 2, max = 100) String name,
      @NotBlank @Email String email,
      @NotBlank @Size(min = 6, max = 100) String password
  ) {}

  public record LoginDto(
      @NotBlank @Email String email,
      @NotBlank String password
  ) {}
}
