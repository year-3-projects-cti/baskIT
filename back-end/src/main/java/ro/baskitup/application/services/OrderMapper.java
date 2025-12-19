package ro.baskitup.application.services;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import ro.baskitup.adapters.persistence.BasketEntity;
import ro.baskitup.adapters.persistence.BasketRepository;
import ro.baskitup.domain.model.Order;
import ro.baskitup.domain.model.OrderItem;
import ro.baskitup.domain.model.OrderStatus;
import ro.baskitup.domain.model.ShippingAddress;
import ro.baskitup.domain.view.OrderView;

@Component
public class OrderMapper {
  private final BasketRepository baskets;

  public OrderMapper(BasketRepository baskets) {
    this.baskets = baskets;
  }

  public OrderView toView(Order order) {
    var itemsList = order.getItems() == null ? List.<OrderItem>of() : order.getItems();
    var basketLookup = resolveBaskets(itemsList);
    List<OrderView.Item> items = itemsList.stream()
        .map(item -> toItem(item, basketLookup.get(item.getBasketId())))
        .toList();

    BigDecimal shipping = safe(order.getShippingFee());
    BigDecimal vat = safe(order.getVatAmount());
    BigDecimal total = safe(order.getTotalAmount());
    BigDecimal subtotal = total.subtract(shipping).subtract(vat);

    ShippingAddress addr = order.getShippingAddress();
    String address = null;
    if (addr != null) {
      address = java.util.stream.Stream.of(addr.getLine1(), addr.getLine2(), addr.getCity(), addr.getCounty(), addr.getPostalCode())
          .filter(part -> part != null && !part.isBlank())
          .collect(Collectors.joining(", "));
    }

    return new OrderView(
        order.getId(),
        order.getOrderNumber(),
        order.getCreatedAt() != null ? order.getCreatedAt().toString() : Instant.now().toString(),
        mapStatus(order.getStatus()),
        shipping.compareTo(BigDecimal.valueOf(30)) > 0 ? "express" : "standard",
        order.getGiftNote(),
        order.getClientKey() != null ? order.getClientKey() : order.getUserKey(),
        new OrderView.Customer(
            order.getCustomerName(),
            order.getCustomerEmail(),
            order.getCustomerPhone(),
            address
        ),
        new OrderView.Totals(subtotal, shipping, vat, total),
        items
    );
  }

  private static String mapStatus(OrderStatus status) {
    if (status == null) return "processing";
    return switch (status) {
      case CREATED -> "processing";
      case PAID -> "shipped";
      case FULFILLED -> "delivered";
      case CANCELED -> "canceled";
    };
  }

  private static OrderView.Item toItem(OrderItem item, BasketEntity basket) {
    return new OrderView.Item(
        item.getBasketId(),
        basket != null ? basket.getSlug() : null,
        basket != null ? basket.getTitle() : item.getTitleSnapshot(),
        item.getUnitAmount(),
        item.getQuantity(),
        basket != null ? basket.getHeroImage() : null
    );
  }

  private static BigDecimal safe(BigDecimal value) {
    return value == null ? BigDecimal.ZERO : value;
  }

  private java.util.Map<UUID, BasketEntity> resolveBaskets(List<OrderItem> items) {
    if (items == null || items.isEmpty()) return Collections.emptyMap();
    List<UUID> ids = items.stream().map(OrderItem::getBasketId).toList();
    return baskets.findAllById(ids).stream().collect(Collectors.toMap(BasketEntity::getId, Function.identity()));
  }
}
