package ro.baskitup.application.services;

import java.math.BigDecimal;
import java.util.List;

public record OrderSnapshotRequest(
    String number,
    String createdAt,
    String status,
    String shippingMethod,
    String userKey,
    String note,
    Customer customer,
    Totals totals,
    List<Item> items
) {
  public record Customer(String name, String email, String phone, String address) {}
  public record Totals(BigDecimal subtotal, BigDecimal shipping, BigDecimal vat, BigDecimal total) {}
  public record Item(String id, String slug, String title, BigDecimal price, int quantity, String heroImage) {}
}
