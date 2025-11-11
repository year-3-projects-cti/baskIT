package ro.baskitup.domain.view;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record BasketDetailView(
    UUID id,
    String slug,
    String title,
    String category,
    String prompt,
    List<String> tags,
    BigDecimal price,
    int stock,
    String heroImage,
    Instant createdAt,
    Instant updatedAt,
    String descriptionHtml
) {
}
