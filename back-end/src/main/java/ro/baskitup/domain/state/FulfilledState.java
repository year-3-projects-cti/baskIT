package ro.baskitup.domain.state;

import ro.baskitup.domain.model.Order;
import ro.baskitup.domain.model.OrderStatus;

public class FulfilledState implements OrderState {
  @Override public void pay(Order order, String paymentRef) { }
  @Override public void fulfill(Order order, String tracking) { }
  @Override public void cancel(Order order, String reason) {
    throw new IllegalStateException("Cannot cancel fulfilled order");
  }
  @Override public String name() { return OrderStatus.FULFILLED.name(); }
}