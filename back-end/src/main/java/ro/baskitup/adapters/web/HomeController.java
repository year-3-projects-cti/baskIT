package ro.baskitup.adapters.web;

import org.springframework.web.bind.annotation.GetMapping;

public class HomeController {
    @GetMapping("/api/featured")
public Object featured(ro.baskitup.application.services.RecommendationEngine engine) {
  return engine.getFeatured();
}

}
