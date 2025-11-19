package ro.baskitup.application.strategy;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import ro.baskitup.adapters.persistence.BasketRepository;
import ro.baskitup.application.services.BasketMapper;
import ro.baskitup.domain.view.BasketSummaryView;

import java.util.Comparator;
import java.util.List;

@Component
@Order(100)
public class NewestRecommendationStrategy implements RecommendationStrategy {

  private final BasketRepository baskets;
  private final BasketMapper mapper;

  public NewestRecommendationStrategy(BasketRepository baskets, BasketMapper mapper) {
    this.baskets = baskets;
    this.mapper = mapper;
  }

  @Override
  public List<BasketSummaryView> featured(RecommendationContext context) {
    return baskets.findAll().stream()
        .sorted(Comparator.comparing(entity -> entity.getCreatedAt(), Comparator.nullsLast(Comparator.reverseOrder())))
        .limit(4)
        .map(mapper::toSummary)
        .toList();
  }
}
