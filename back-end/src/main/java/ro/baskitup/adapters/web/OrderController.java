package ro.baskitup.adapters.web;

import org.springframework.web.bind.annotation.*;
import ro.baskitup.application.services.OrderService;
import ro.baskitup.domain.model.Order;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService service;
  public OrderController(OrderService service) { this.service = service; }

  // GET /api/orders  -> list all (for debugging)
  @GetMapping
  public List<Order> list() {
    return service.list();
  }

  // POST /api/orders -> create new
  @PostMapping
  public Order create() {
    return service.create();
  }

  // POST /api/orders/{id}/paid
  @PostMapping("/{id}/paid")
  public Order paid(@PathVariable UUID id, @RequestBody Map<String, String> body) {
    return service.markPaid(id, body.getOrDefault("paymentRef", "TEST-REF"));
  }

  // POST /api/orders/{id}/fulfill
  @PostMapping("/{id}/fulfill")
  public Order fulfill(@PathVariable UUID id, @RequestBody Map<String, String> body) {
    return service.fulfill(id, body.getOrDefault("tracking", "TRK-TEST"));
  }

  // POST /api/orders/{id}/cancel
  @PostMapping("/{id}/cancel")
  public Order cancel(@PathVariable UUID id, @RequestBody Map<String, String> body) {
    return service.cancel(id, body.getOrDefault("reason", "user_request"));
  }
}