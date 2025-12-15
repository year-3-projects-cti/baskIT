package ro.baskitup.application.ports;

import java.util.UUID;

/**
 * Port that abstracts payment provider interactions (Stripe, etc.).
 */
public interface PaymentPort {

  /**
   * Creates a payment intent/session with the external provider and returns the client-facing reference.
   *
   * @param orderId   internal order identifier
   * @param amountMinorUnits amount expressed in bani (RON * 100)
   * @return provider reference/token used by the front-end
   */
  String createPaymentIntent(UUID orderId, int amountMinorUnits);

  /**
   * Verifies an incoming webhook payload/signature and extracts the payment reference we care about.
   */
  String verifyWebhook(String payload, String signature);
}
