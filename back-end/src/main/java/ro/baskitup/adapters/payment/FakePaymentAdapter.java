package ro.baskitup.adapters.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ro.baskitup.application.ports.PaymentPort;

import java.util.UUID;

/**
 * Simple fake adapter used for local development instead of hitting Stripe.
 */
@Component
public class FakePaymentAdapter implements PaymentPort {
  private static final Logger log = LoggerFactory.getLogger(FakePaymentAdapter.class);

  @Override
  public String createPaymentIntent(UUID orderId, int amountRon) {
    String token = "pi_" + orderId + "_" + amountRon;
    log.info("Simulating payment intent for order {} amount {} -> {}", orderId, amountRon, token);
    return token;
  }

  @Override
  public String verifyWebhook(String payload, String signature) {
    log.info("Simulating webhook verification payload={} signature={}", payload, signature);
    return "pay_" + UUID.randomUUID();
  }
}
