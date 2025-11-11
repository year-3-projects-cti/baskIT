package ro.baskitup.adapters.web;

import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.baskitup.application.services.BasketService;
import ro.baskitup.domain.view.BasketDetailView;
import ro.baskitup.domain.view.BasketSummaryView;

import java.util.List;

@RestController
@RequestMapping("/api/baskets")
@Validated
public class BasketController {

  private final BasketService basketService;

  public BasketController(BasketService basketService) {
    this.basketService = basketService;
  }

  @GetMapping
  public List<BasketSummaryView> list(
      @RequestParam(value = "category", required = false) String category,
      @RequestParam(value = "search", required = false) @Size(max = 120) String search
  ) {
    return basketService.list(category, search);
  }

  @GetMapping("/{slug}")
  public BasketDetailView bySlug(@PathVariable String slug) {
    return basketService.findBySlug(slug);
  }
}
