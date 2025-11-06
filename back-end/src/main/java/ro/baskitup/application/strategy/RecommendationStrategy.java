package ro.baskitup.application.strategy;

import ro.baskitup.domain.view.BasketView;
import java.util.List;

public interface RecommendationStrategy {
  List<BasketView> featured();
}