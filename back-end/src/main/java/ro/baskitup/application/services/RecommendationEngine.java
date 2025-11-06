package ro.baskitup.application.services;

import org.springframework.stereotype.Service;
import ro.baskitup.application.strategy.ManualCurationStrategy;
import ro.baskitup.application.strategy.RecommendationStrategy;
import ro.baskitup.domain.view.BasketView;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class RecommendationEngine {
  private final AtomicReference<RecommendationStrategy> strategy =
      new AtomicReference<>(new ManualCurationStrategy());

  public List<BasketView> getFeatured() { return strategy.get().featured(); }
  public void setStrategy(RecommendationStrategy s) { strategy.set(s); }
}