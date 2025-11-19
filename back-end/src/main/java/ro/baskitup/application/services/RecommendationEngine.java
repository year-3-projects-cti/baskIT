package ro.baskitup.application.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ro.baskitup.application.strategy.RecommendationContext;
import ro.baskitup.application.strategy.RecommendationStrategy;
import ro.baskitup.domain.view.BasketSummaryView;

import java.util.List;

@Service
public class RecommendationEngine {
  private static final Logger log = LoggerFactory.getLogger(RecommendationEngine.class);

  private final List<RecommendationStrategy> strategies;

  public RecommendationEngine(List<RecommendationStrategy> strategies) {
    this.strategies = strategies;
  }

  public List<BasketSummaryView> getFeatured() {
    RecommendationContext context = RecommendationContext.now();
    for (RecommendationStrategy strategy : strategies) {
      if (!strategy.supports(context)) {
        continue;
      }
      List<BasketSummaryView> featured = strategy.featured(context);
      if (!featured.isEmpty()) {
        log.debug("Recommendation strategy {} returned {} baskets", strategy.name(), featured.size());
        return featured;
      }
    }
    log.debug("No recommendation strategy returned results, responding with empty list");
    return List.of();
  }
}
