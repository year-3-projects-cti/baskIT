package ro.baskitup.adapters.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.baskitup.application.services.BasketService;
import ro.baskitup.domain.view.BasketDetailView;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/baskets")
@PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
public class AdminBasketController {

  private final BasketService basketService;

  public AdminBasketController(BasketService basketService) {
    this.basketService = basketService;
  }

  @PostMapping
  public ResponseEntity<BasketDetailView> create(@Valid @RequestBody BasketDto request) {
    BasketDetailView created = basketService.create(request.toRequest());
    return ResponseEntity.ok(created);
  }

  @PutMapping("/{id}")
  public BasketDetailView update(@PathVariable UUID id, @Valid @RequestBody BasketDto request) {
    return basketService.update(id, request.toRequest());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    basketService.delete(id);
    return ResponseEntity.noContent().build();
  }

  public record BasketDto(
      @NotBlank @Size(max = 160) String title,
      @Size(max = 160) String slug,
      @NotBlank @Size(max = 80) String category,
      @NotBlank @Size(max = 512) String prompt,
      @NotNull List<@NotBlank @Size(max = 64) String> tags,
      @NotNull @Positive BigDecimal price,
      @Min(0) int stock,
      @NotBlank String description,
      @Size(max = 512) String heroImage
  ) {
    BasketService.BasketRequest toRequest() {
      return new BasketService.BasketRequest(
          title,
          slug,
          category,
          prompt,
          tags,
          price,
          stock,
          description,
          heroImage
      );
    }
  }
}
