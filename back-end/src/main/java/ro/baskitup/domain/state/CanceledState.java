package ro.baskitup.domain.state;

import ro.baskitup.domain.model.Order;
import ro.baskitup.domain.model.OrderStatus;

public class CanceledState implements OrderState {
  public CanceledState() { }
  @Override public void pay(Order order, String paymentRef) { throw new IllegalStateException("Canceled"); }
  @Override public void fulfill(Order order, String tracking) { throw new IllegalStateException("Canceled"); }
  @Override public void cancel(Order order, String reason) { }
  @Override public String name() { return OrderStatus.CANCELED.name(); }
}