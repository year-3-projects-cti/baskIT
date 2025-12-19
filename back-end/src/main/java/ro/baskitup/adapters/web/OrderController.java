package ro.baskitup.adapters.web;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import ro.baskitup.application.services.OrderService;
import ro.baskitup.application.services.OrderSnapshotRequest;
import ro.baskitup.domain.model.Order;
import ro.baskitup.domain.view.OrderView;
import ro.baskitup.domain.view.OrderView;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService service;
  public OrderController(OrderService service) { this.service = service; }

  // GET /api/orders  -> list all (for debugging)
  @GetMapping
  public java.util.Map<String, java.util.List<OrderView>> list() {
    return service.listBucket();
  }

  // POST /api/orders -> create new
  @PostMapping
  public OrderView create(@Valid @RequestBody OrderSnapshotRequest request) {
    return service.createSnapshot(request);
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

  @PostMapping("/{id}/status")
  public ro.baskitup.domain.view.OrderView updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
    return service.updateStatus(id, body.getOrDefault("status", "processing"));
  }
}
