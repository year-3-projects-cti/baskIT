package ro.baskitup.adapters.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.baskitup.application.ports.PaymentPort;
import ro.baskitup.application.services.OrderService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/webhooks")
public class WebhookController {
  private final PaymentPort paymentPort;
  private final OrderService orders;

  public WebhookController(PaymentPort paymentPort, OrderService orders) {
    this.paymentPort = paymentPort; this.orders = orders;
  }

  @PostMapping("/stripe/simulate")
  public ResponseEntity<?> simulate(@RequestBody Map<String, String> body) {
    UUID orderId = UUID.fromString(body.get("orderId"));
    String paymentRef = paymentPort.verifyWebhook("payload", "sig");
    orders.markPaid(orderId, paymentRef);
    return ResponseEntity.ok(Map.of("ok", true));
  }
}