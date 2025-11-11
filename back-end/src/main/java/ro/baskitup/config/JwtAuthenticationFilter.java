package ro.baskitup.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.baskitup.adapters.persistence.UserEntity;
import ro.baskitup.adapters.persistence.UserRepository;
import ro.baskitup.domain.model.UserRole;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtTokenService jwtTokenService;
  private final UserRepository users;

  public JwtAuthenticationFilter(JwtTokenService jwtTokenService, UserRepository users) {
    this.jwtTokenService = jwtTokenService;
    this.users = users;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      try {
        UUID userId = jwtTokenService.parseUserId(token);
        Optional<UserEntity> userOpt = users.findById(userId);
        if (userOpt.isPresent()) {
          UserEntity user = userOpt.get();
          UserRole role = user.getRole();
          UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
              new SecuredUser(user.getId(), user.getEmail(), user.getName(), role),
              null,
              List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
          );
          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
      } catch (Exception ignored) {
        SecurityContextHolder.clearContext();
      }
    }
    filterChain.doFilter(request, response);
  }

  public record SecuredUser(UUID id, String email, String name, UserRole role) {}
}
