package ro.baskitup.application.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import ro.baskitup.adapters.persistence.BasketEntity;
import ro.baskitup.adapters.persistence.BasketRepository;
import ro.baskitup.domain.view.BasketDetailView;
import ro.baskitup.domain.view.BasketSummaryView;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@Transactional
public class BasketService {
  private static final Pattern NON_ALNUM = Pattern.compile("[^a-z0-9]+");

  private final BasketRepository baskets;

  public BasketService(BasketRepository baskets) {
    this.baskets = baskets;
  }

  @Transactional(readOnly = true)
  public List<BasketSummaryView> list(String category, String search) {
    return baskets.findAll().stream()
        .filter(b -> filterByCategory(b, category))
        .filter(b -> filterBySearch(b, search))
        .sorted(Comparator.comparing(BasketEntity::getCreatedAt).reversed())
        .map(this::toSummary)
        .toList();
  }

  @Transactional(readOnly = true)
  public BasketDetailView findBySlug(String slug) {
    BasketEntity basket = baskets.findBySlugIgnoreCase(slug)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coșul cerut nu a fost găsit"));
    return toDetail(basket);
  }

  public BasketDetailView create(BasketRequest request) {
    BasketEntity basket = new BasketEntity();
    apply(basket, request, null);
    baskets.save(basket);
    return toDetail(basket);
  }

  public BasketDetailView update(UUID id, BasketRequest request) {
    BasketEntity basket = baskets.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coșul nu există"));
    apply(basket, request, id);
    return toDetail(basket);
  }

  public void delete(UUID id) {
    baskets.deleteById(id);
  }

  private void apply(BasketEntity basket, BasketRequest request, UUID currentId) {
    basket.setTitle(request.title());
    basket.setCategory(request.category());
    basket.setPrompt(request.prompt());
    List<String> rawTags = Optional.ofNullable(request.tags()).orElse(List.of());
    List<String> uniqueTags = new java.util.ArrayList<>();
    java.util.Set<String> seenKeys = new java.util.LinkedHashSet<>();
    for (String tag : rawTags) {
      String trimmed = tag.trim();
      if (!StringUtils.hasText(trimmed)) {
        continue;
      }
      String key = trimmed.toLowerCase(Locale.ROOT);
      if (seenKeys.add(key)) {
        uniqueTags.add(trimmed);
      }
    }
    basket.setTags(uniqueTags);
    basket.setPrice(request.price());
    basket.setStock(request.stock());
    basket.setDescription(request.description());
    basket.setHeroImage(request.heroImage());

    String desiredSlug = StringUtils.hasText(request.slug()) ? request.slug() : request.title();
    String slug = generateUniqueSlug(desiredSlug, currentId);
    basket.setSlug(slug);
  }

  private String generateUniqueSlug(String source, UUID currentId) {
    String base = slugify(source);
    if (!StringUtils.hasText(base)) {
      base = "basket";
    }
    String candidate = base;
    int suffix = 1;
    while (true) {
      Optional<BasketEntity> existing = baskets.findBySlugIgnoreCase(candidate);
      if (existing.isEmpty() || (currentId != null && existing.get().getId().equals(currentId))) {
        return candidate;
      }
      candidate = base + "-" + suffix++;
    }
  }

  private static String slugify(String input) {
    String normalized = Normalizer.normalize(input == null ? "" : input, Normalizer.Form.NFD)
        .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    String lower = normalized.toLowerCase(Locale.ROOT);
    String collapsed = NON_ALNUM.matcher(lower).replaceAll("-");
    collapsed = collapsed.replaceAll("-{2,}", "-");
    return collapsed.replaceAll("(^-|-$)", "");
  }

  private boolean filterByCategory(BasketEntity basket, String category) {
    if (!StringUtils.hasText(category) || category.equalsIgnoreCase("all")) {
      return true;
    }
    return slugify(basket.getCategory()).equalsIgnoreCase(category);
  }

  private boolean filterBySearch(BasketEntity basket, String search) {
    if (!StringUtils.hasText(search)) {
      return true;
    }
    String needle = search.toLowerCase(Locale.ROOT);
    return basket.getTitle().toLowerCase(Locale.ROOT).contains(needle)
        || basket.getPrompt().toLowerCase(Locale.ROOT).contains(needle)
        || basket.getTags().stream().anyMatch(tag -> tag.toLowerCase(Locale.ROOT).contains(needle));
  }

  private BasketSummaryView toSummary(BasketEntity entity) {
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

  private BasketDetailView toDetail(BasketEntity entity) {
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

  public record BasketRequest(
      String title,
      String slug,
      String category,
      String prompt,
      List<String> tags,
      BigDecimal price,
      int stock,
      String description,
      String heroImage
  ) {
  }
}
