package ro.baskitup.application.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.baskitup.adapters.persistence.OrderRepository;
import ro.baskitup.application.ports.PaymentPort;
import ro.baskitup.domain.model.Order;

@Service
public class CheckoutService {
  private final OrderRepository orders;
  private final PaymentPort paymentPort;

  public CheckoutService(OrderRepository orders, PaymentPort paymentPort) {
    this.orders = orders; this.paymentPort = paymentPort;
  }

  @Transactional
  public String initCheckout(int amountRon) {
    Order o = new Order();
    orders.save(o);
    return paymentPort.createPaymentIntent(o.getId(), amountRon);
  }
}