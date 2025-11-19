package ro.baskitup.application.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import ro.baskitup.adapters.persistence.BasketEntity;
import ro.baskitup.adapters.persistence.BasketRepository;
import ro.baskitup.application.services.BasketMapper;
import ro.baskitup.domain.view.BasketSummaryView;

import java.time.LocalDate;
import java.time.Month;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Stream;

@Component
@Order(0)
public class SeasonalRecommendationStrategy implements RecommendationStrategy {
  private static final Logger log = LoggerFactory.getLogger(SeasonalRecommendationStrategy.class);

  private final BasketRepository baskets;
  private final BasketMapper mapper;
  private final Map<SeasonalTheme, List<String>> keywordMap = new EnumMap<>(SeasonalTheme.class);

  public SeasonalRecommendationStrategy(BasketRepository baskets, BasketMapper mapper) {
    this.baskets = baskets;
    this.mapper = mapper;
    keywordMap.put(SeasonalTheme.CHRISTMAS, List.of("craciun", "christmas", "winter", "holiday", "sarbatori"));
    keywordMap.put(SeasonalTheme.VALENTINES, List.of("valentine", "dragoste", "love", "romantic", "hearts"));
    keywordMap.put(SeasonalTheme.EASTER, List.of("paste", "easter", "martisor", "spring", "primavara", "bunny"));
    keywordMap.put(SeasonalTheme.SUMMER, List.of("summer", "vara", "fructe", "fresh", "tropical"));
  }

  @Override
  public List<BasketSummaryView> featured(RecommendationContext context) {
    SeasonalTheme theme = determineTheme(context.date());
    List<String> keywords = keywordMap.getOrDefault(theme, List.of());
    List<BasketSummaryView> picks = baskets.findAll().stream()
        .filter(b -> matchesTheme(b, keywords))
        .sorted(Comparator.comparing(BasketEntity::getCreatedAt).reversed())
        .limit(4)
        .map(mapper::toSummary)
        .toList();
    if (!picks.isEmpty()) {
      log.debug("Seasonal strategy selected theme {} and returned {} baskets", theme, picks.size());
    }
    return picks;
  }

  private SeasonalTheme determineTheme(LocalDate date) {
    Month month = date.getMonth();
    if (month == Month.NOVEMBER || month == Month.DECEMBER) {
      return SeasonalTheme.CHRISTMAS;
    }
    if (month == Month.JANUARY || month == Month.FEBRUARY) {
      return SeasonalTheme.VALENTINES;
    }
    if (month == Month.MARCH || month == Month.APRIL) {
      return SeasonalTheme.EASTER;
    }
    if (month == Month.JUNE || month == Month.JULY || month == Month.AUGUST) {
      return SeasonalTheme.SUMMER;
    }
    return SeasonalTheme.CLASSIC;
  }

  private boolean matchesTheme(BasketEntity entity, List<String> keywords) {
    if (keywords.isEmpty()) {
      return false;
    }
    String haystack = Stream.of(entity.getTitle(), entity.getPrompt(), entity.getCategory(), String.join(" ", entity.getTags()))
        .filter(StringUtils::hasText)
        .map(value -> value.toLowerCase(Locale.ROOT))
        .reduce("", (acc, value) -> acc + " " + value);
    return keywords.stream().anyMatch(keyword -> haystack.contains(keyword.toLowerCase(Locale.ROOT)));
  }

  private enum SeasonalTheme {
    CHRISTMAS, VALENTINES, EASTER, SUMMER, CLASSIC
  }
}
