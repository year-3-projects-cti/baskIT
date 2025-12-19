package ro.baskitup.orders.application.services;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Component;
import ro.baskitup.orders.domain.model.Order;
import ro.baskitup.orders.domain.model.OrderItem;
import ro.baskitup.orders.domain.model.ShippingAddress;
import ro.baskitup.orders.domain.view.OrderView;

@Component
public class OrderMapper {
  public OrderView toView(Order order) {
    BigDecimal shipping = safe(order.getShippingFee());
    BigDecimal vat = safe(order.getVatAmount());
    BigDecimal total = safe(order.getTotalAmount());
    ShippingAddress addr = order.getShippingAddress();
    return new OrderView(
        order.getId(),
        order.getOrderNumber(),
        order.getCreatedAt(),
        order.getStatus().name().toLowerCase(),
        order.getShippingFee() != null && order.getShippingFee().compareTo(BigDecimal.valueOf(30)) > 0 ? "express" : "standard",
        order.getGiftNote(),
        order.getClientKey(),
        order.getUserKey(),
        new OrderView.Customer(order.getCustomerName(), order.getCustomerEmail(), order.getCustomerPhone(),
            addr != null ? addr.getLine1() : null),
        new OrderView.Totals(order.getTotalAmount().subtract(shipping).subtract(vat), shipping, vat, total),
        order.getItems().stream().map(this::mapItem).toList()
    );
  }

  private OrderView.Item mapItem(OrderItem item) {
    return new OrderView.Item(
        item.getBasketId(),
        item.getBasketId() != null ? item.getBasketId().toString() : null,
        item.getTitleSnapshot(),
        item.getUnitAmount(),
        item.getQuantity(),
        null
    );
  }

  private static BigDecimal safe(BigDecimal value) {
    return value == null ? BigDecimal.ZERO : value;
  }
}
