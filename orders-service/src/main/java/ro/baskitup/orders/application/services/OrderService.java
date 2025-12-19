package ro.baskitup.orders.application.services;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.baskitup.orders.adapters.persistence.OrderRepository;
import ro.baskitup.orders.application.ports.DomainEventBus;
import ro.baskitup.orders.domain.events.OrderPaid;
import ro.baskitup.orders.domain.model.Order;
import ro.baskitup.orders.domain.model.OrderItem;
import ro.baskitup.orders.domain.model.OrderStatus;
import ro.baskitup.orders.domain.model.ShippingAddress;
import ro.baskitup.orders.domain.view.OrderView;

@Service
public class OrderService {
  private final OrderRepository repo;
  private final DomainEventBus bus;
  private final OrderMapper mapper;

  public OrderService(OrderRepository repo, DomainEventBus bus, OrderMapper mapper) {
    this.repo = repo;
    this.bus = bus;
    this.mapper = mapper;
  }

  public List<Order> list() {
    List<Order> out = new ArrayList<>();
    repo.findAll().forEach(out::add);
    return out;
  }

  @Transactional
  public OrderView createSnapshot(OrderSnapshotRequest request) {
    Order order = new Order();
    if (request.number() != null && !request.number().isBlank()) {
      order.setOrderNumber(request.number());
    }
    order.setGiftNote(request.note());
    order.setClientKey(request.userKey());
    order.setUserKey(request.userKey());
    order.setCustomerName(request.customer() != null ? request.customer().name() : null);
    order.setCustomerEmail(request.customer() != null ? request.customer().email() : null);
    order.setCustomerPhone(request.customer() != null ? request.customer().phone() : null);
    String address = request.customer() != null ? request.customer().address() : null;
    order.setShippingAddress(address == null ? null : new ShippingAddress(address, null, null, null, null));

    OrderStatus status = mapStatus(request.status());
    order.setStatus(status);

    BigDecimal shipping = safe(request.totals() != null ? request.totals().shipping() : null);
    BigDecimal vat = safe(request.totals() != null ? request.totals().vat() : null);
    BigDecimal total = safe(request.totals() != null ? request.totals().total() : null);
    if (shipping.compareTo(BigDecimal.ZERO) == 0 && request.shippingMethod() != null) {
      shipping = "express".equalsIgnoreCase(request.shippingMethod()) ? BigDecimal.valueOf(35) : BigDecimal.valueOf(25);
      total = safe(request.totals() != null ? request.totals().total() : shipping.add(vat));
    }
    order.setShippingFee(shipping);
    order.setVatAmount(vat);
    order.setTotalAmount(total);
    if (request.createdAt() != null && !request.createdAt().isBlank()) {
      try {
        order.setCreatedAt(Instant.parse(request.createdAt()));
      } catch (Exception ignored) {
        order.setCreatedAt(Instant.now());
      }
    }

    if (request.items() != null) {
      for (OrderSnapshotRequest.Item itemReq : request.items()) {
        OrderItem item = new OrderItem();
        item.setBasketId(itemReq.id() != null ? itemReq.id() : UUID.randomUUID());
        item.setTitleSnapshot(itemReq.title());
        item.setUnitAmount(itemReq.price());
        item.setQuantity(itemReq.quantity());
        order.addItem(item);
      }
    }

    Order saved = repo.save(order);
    return mapper.toView(saved);
  }

  @Transactional
  public Order markPaid(UUID id, String ref) {
    Order o = repo.findById(id).orElseThrow();
    o.setStatus(OrderStatus.PAID);
    o.setPaymentRef(ref);
    repo.save(o);
    bus.publish(new OrderPaid(o.getId()));
    return o;
  }

  @Transactional
  public Order fulfill(UUID id, String tracking) {
    Order o = repo.findById(id).orElseThrow();
    o.setStatus(OrderStatus.FULFILLED);
    o.setTrackingNumber(tracking);
    return repo.save(o);
  }

  @Transactional
  public Order cancel(UUID id, String reason) {
    Order o = repo.findById(id).orElseThrow();
    o.setStatus(OrderStatus.CANCELED);
    o.setCancelReason(reason);
    return repo.save(o);
  }

  @Transactional
  public OrderView updateStatus(UUID id, String status) {
    Order o = repo.findById(id).orElseThrow();
    OrderStatus next = mapStatus(status);
    o.setStatus(next);
    Order saved = repo.save(o);
    if (next == OrderStatus.PAID) {
      bus.publish(new OrderPaid(saved.getId()));
    }
    return mapper.toView(saved);
  }

  @Transactional(readOnly = true)
  public List<OrderView> listViews() {
    List<OrderView> views = new ArrayList<>();
    repo.findAll().forEach(o -> views.add(mapper.toView(o)));
    return views;
  }

  @Transactional(readOnly = true)
  public java.util.Map<String, java.util.List<OrderView>> listBucket() {
    var views = listViews();
    return views.stream().collect(java.util.stream.Collectors.groupingBy(
        v -> {
          if (v.clientKey() != null && !v.clientKey().isBlank()) return v.clientKey();
          if (v.customer() != null && v.customer().email() != null && !v.customer().email().isBlank()) {
            return v.customer().email();
          }
          return "guest";
        }
    ));
  }

  private static BigDecimal safe(BigDecimal value) {
    return value == null ? BigDecimal.ZERO : value;
  }

  private static OrderStatus mapStatus(String status) {
    if (status == null) return OrderStatus.CREATED;
    return switch (status.toLowerCase()) {
      case "shipped" -> OrderStatus.PAID;
      case "delivered" -> OrderStatus.FULFILLED;
      case "canceled" -> OrderStatus.CANCELED;
      default -> OrderStatus.CREATED;
    };
  }
}
