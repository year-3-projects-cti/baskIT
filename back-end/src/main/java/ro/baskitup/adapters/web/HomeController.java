package ro.baskitup.adapters.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.baskitup.application.services.RecommendationEngine;
import ro.baskitup.domain.view.BasketSummaryView;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HomeController {
  private final RecommendationEngine engine;

  public HomeController(RecommendationEngine engine) {
    this.engine = engine;
  }

  @GetMapping("/featured")
  public List<BasketSummaryView> featured() {
    return engine.getFeatured();
  }
}
