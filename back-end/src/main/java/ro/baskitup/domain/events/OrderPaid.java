package ro.baskitup.domain.events;

import java.util.UUID;

public class OrderPaid {
  private final UUID orderId;
  public OrderPaid(UUID orderId) { this.orderId = orderId; }
  public UUID getOrderId() { return orderId; }
}