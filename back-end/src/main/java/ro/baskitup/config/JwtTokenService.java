package ro.baskitup.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ro.baskitup.adapters.persistence.UserEntity;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenService {
  private final Key signingKey;
  private final long expirationSeconds;

  public JwtTokenService(
      @Value("${app.security.jwt-secret:change-me-in-env}") String secret,
      @Value("${app.security.jwt-expiration-seconds:86400}") long expirationSeconds
  ) {
    if (secret.length() < 32) {
      throw new IllegalArgumentException("JWT secret must be at least 32 characters");
    }
    this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationSeconds = expirationSeconds;
  }

  public String generateToken(UserEntity user) {
    Instant now = Instant.now();
    return Jwts.builder()
        .setSubject(user.getId().toString())
        .claim("role", user.getRole().name())
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(now.plusSeconds(expirationSeconds)))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public UUID parseUserId(String token) {
    Jws<Claims> claims = Jwts.parserBuilder()
        .setSigningKey(signingKey)
        .build()
        .parseClaimsJws(token);
    return UUID.fromString(claims.getBody().getSubject());
  }
}
