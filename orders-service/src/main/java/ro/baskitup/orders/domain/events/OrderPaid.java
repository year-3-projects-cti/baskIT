package ro.baskitup.orders.domain.events;

import java.util.UUID;

public class OrderPaid {
  private UUID orderId;

  public OrderPaid() {}

  public OrderPaid(UUID orderId) {
    this.orderId = orderId;
  }

  public UUID getOrderId() { return orderId; }
  public void setOrderId(UUID orderId) { this.orderId = orderId; }
}
