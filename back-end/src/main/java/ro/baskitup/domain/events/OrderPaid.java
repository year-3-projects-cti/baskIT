package ro.baskitup.domain.events;

import java.util.UUID;

public class OrderPaid {
  private UUID orderId;

  public OrderPaid() {
    // for Jackson deserialization
  }

  public OrderPaid(UUID orderId) { this.orderId = orderId; }
  public UUID getOrderId() { return orderId; }
}
