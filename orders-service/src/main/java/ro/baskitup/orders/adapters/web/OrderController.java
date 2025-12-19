package ro.baskitup.orders.adapters.web;

import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.baskitup.orders.application.services.OrderService;
import ro.baskitup.orders.application.services.OrderSnapshotRequest;
import ro.baskitup.orders.domain.model.Order;
import ro.baskitup.orders.domain.view.OrderView;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService service;
  public OrderController(OrderService service) { this.service = service; }

  @GetMapping
  public java.util.Map<String, java.util.List<OrderView>> list() {
    return service.listBucket();
  }

  @PostMapping
  public OrderView create(@Valid @RequestBody OrderSnapshotRequest request) {
    return service.createSnapshot(request);
  }

  @PostMapping("/{id}/paid")
  public Order paid(@PathVariable UUID id, @RequestBody Map<String, String> body) {
    return service.markPaid(id, body.getOrDefault("paymentRef", "TEST-REF"));
  }

  @PostMapping("/{id}/fulfill")
  public Order fulfill(@PathVariable UUID id, @RequestBody Map<String, String> body) {
    return service.fulfill(id, body.getOrDefault("tracking", "TRK-TEST"));
  }

  @PostMapping("/{id}/cancel")
  public Order cancel(@PathVariable UUID id, @RequestBody Map<String, String> body) {
    return service.cancel(id, body.getOrDefault("reason", "user_request"));
  }

  @PostMapping("/{id}/status")
  public OrderView updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
    return service.updateStatus(id, body.getOrDefault("status", "processing"));
  }
}
