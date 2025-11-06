package ro.baskitup.application.strategy;

import ro.baskitup.domain.view.BasketView;
import java.util.List;

public class ManualCurationStrategy implements RecommendationStrategy {
  @Override
  public List<BasketView> featured() {
    return List.of(
      new BasketView(1L, "Coffee Lover", 14999, 12),
      new BasketView(2L, "Spa & Relax", 19999, 7)
    );
  }
}