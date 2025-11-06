package ro.baskitup.domain.state;

import ro.baskitup.domain.model.Order;
import ro.baskitup.domain.model.OrderStatus;

public class CreatedState implements OrderState {
  @Override
  public void pay(Order order, String paymentRef) {
    order.setPaymentRef(paymentRef);
    order.setStatus(OrderStatus.PAID);
    order.setState(new PaidState());
  }
  @Override
  public void fulfill(Order order, String tracking) {
    throw new IllegalStateException("Order must be paid before fulfillment");
  }
  @Override
  public void cancel(Order order, String reason) {
    order.setCancelReason(reason);
    order.setStatus(OrderStatus.CANCELED);
    order.setState(new CanceledState());
  }
  @Override public String name() { return OrderStatus.CREATED.name(); }
}