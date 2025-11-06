package ro.baskitup.domain.state;

import ro.baskitup.domain.model.Order;
import ro.baskitup.domain.model.OrderStatus;

public class PaidState implements OrderState {
  @Override
  public void pay(Order order, String paymentRef) {
    // idempotent: already paid
  }
  @Override
  public void fulfill(Order order, String tracking) {
    order.setTrackingNumber(tracking);
    order.setStatus(OrderStatus.FULFILLED);
    order.setState(new FulfilledState());
  }
  @Override
  public void cancel(Order order, String reason) {
    order.setCancelReason(reason);
    order.setStatus(OrderStatus.CANCELED);
    order.setState(new CanceledState());
  }
  @Override public String name() { return OrderStatus.PAID.name(); }
}