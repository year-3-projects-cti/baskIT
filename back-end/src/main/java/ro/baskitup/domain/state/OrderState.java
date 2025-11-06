package ro.baskitup.domain.state;

import ro.baskitup.domain.model.Order;

public interface OrderState {
  void pay(Order order, String paymentRef);
  void fulfill(Order order, String tracking);
  void cancel(Order order, String reason);
  String name();
}