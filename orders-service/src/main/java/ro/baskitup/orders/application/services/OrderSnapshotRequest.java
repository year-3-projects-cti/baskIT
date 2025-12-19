package ro.baskitup.orders.application.services;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderSnapshotRequest(
    @NotBlank String number,
    @NotBlank String status,
    @NotNull String shippingMethod,
    String createdAt,
    String note,
    String userKey,
    Customer customer,
    Totals totals,
    List<Item> items
) {
  public record Customer(String name, String email, String phone, String address) {}
  public record Totals(@NotNull BigDecimal subtotal, @NotNull BigDecimal shipping, @NotNull BigDecimal vat, @NotNull BigDecimal total) {}
  public record Item(UUID id, String slug, @NotBlank String title, @NotNull BigDecimal price, @NotNull Integer quantity, String heroImage) {}
}
