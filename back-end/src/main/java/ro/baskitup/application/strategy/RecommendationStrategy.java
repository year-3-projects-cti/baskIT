package ro.baskitup.application.strategy;

import ro.baskitup.domain.view.BasketSummaryView;

import java.util.List;

public interface RecommendationStrategy {
  /**
   * Whether the strategy can run under the current context.
   */
  default boolean supports(RecommendationContext context) {
    return true;
  }

  /**
   * Returns a list of featured baskets (may be empty). The first strategy returning
   * a non-empty list "wins".
   */
  List<BasketSummaryView> featured(RecommendationContext context);

  /**
   * Simple name that can be logged/inspected.
   */
  default String name() {
    return getClass().getSimpleName();
  }
}
