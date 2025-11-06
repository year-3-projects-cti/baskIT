package ro.baskitup.adapters.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.baskitup.application.services.CheckoutService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CheckoutController {
  private final CheckoutService checkout;
  public CheckoutController(CheckoutService checkout) { this.checkout = checkout; }

  @PostMapping("/checkout")
  public Map<String, String> checkout(@RequestBody Map<String, Object> body) {
    int amountRon = (int) body.getOrDefault("amountRon", 10000);
    String clientSecret = checkout.initCheckout(amountRon);
    return Map.of("clientSecret", clientSecret);
  }
}