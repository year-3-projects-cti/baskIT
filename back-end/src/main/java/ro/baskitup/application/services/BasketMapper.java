package ro.baskitup.application.services;

import org.springframework.stereotype.Component;
import ro.baskitup.adapters.persistence.BasketEntity;
import ro.baskitup.domain.view.BasketDetailView;
import ro.baskitup.domain.view.BasketSummaryView;

@Component
public class BasketMapper {

  public BasketSummaryView toSummary(BasketEntity entity) {
    return new BasketSummaryView(
        entity.getId(),
        entity.getSlug(),
        entity.getTitle(),
        entity.getCategory(),
        entity.getPrompt(),
        entity.getTags(),
        entity.getPrice(),
        entity.getStock(),
        entity.getHeroImage(),
        entity.getCreatedAt(),
        entity.getUpdatedAt()
    );
  }

  public BasketDetailView toDetail(BasketEntity entity) {
    return new BasketDetailView(
        entity.getId(),
        entity.getSlug(),
        entity.getTitle(),
        entity.getCategory(),
        entity.getPrompt(),
        entity.getTags(),
        entity.getPrice(),
        entity.getStock(),
        entity.getHeroImage(),
        entity.getCreatedAt(),
        entity.getUpdatedAt(),
        entity.getDescription()
    );
  }
}
