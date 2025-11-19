package ro.baskitup.application.strategy;

import java.time.Clock;
import java.time.LocalDate;

public record RecommendationContext(LocalDate date) {
  public static RecommendationContext now() {
    return new RecommendationContext(LocalDate.now());
  }

  public static RecommendationContext now(Clock clock) {
    return new RecommendationContext(LocalDate.now(clock));
  }
}
