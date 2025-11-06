package ro.baskitup.application.strategy;

import ro.baskitup.domain.view.BasketView;
import java.util.List;

public class NewestStrategy implements RecommendationStrategy {
  @Override
  public List<BasketView> featured() {
    return List.of(
      new BasketView(3L, "Taste of Transylvania", 17999, 5),
      new BasketView(4L, "Holiday Spark", 22999, 20)
    );
  }
}