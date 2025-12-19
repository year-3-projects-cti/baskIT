package ro.baskitup.orders.domain.view;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderView(
    UUID id,
    String number,
    Instant createdAt,
    String status,
    String shippingMethod,
    String note,
    String clientKey,
    String userKey,
    Customer customer,
    Totals totals,
    List<Item> items
) {
  public record Customer(String name, String email, String phone, String address) {}
  public record Totals(BigDecimal subtotal, BigDecimal shipping, BigDecimal vat, BigDecimal total) {}
  public record Item(UUID id, String slug, String title, BigDecimal price, Integer quantity, String heroImage) {}
}
