package ro.baskitup.application.services;

import ro.baskitup.application.ports.DomainEventBus;
import ro.baskitup.domain.events.OrderPaid;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.baskitup.adapters.persistence.OrderRepository;
import ro.baskitup.domain.model.Order;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
  private final OrderRepository repo;
  private final DomainEventBus bus;

  public OrderService(OrderRepository repo, DomainEventBus bus) {
    this.repo = repo;
    this.bus = bus;
  }

  public List<Order> list() {
    List<Order> out = new ArrayList<>();
    repo.findAll().forEach(out::add);
    return out;
  }

  @Transactional
  public Order create() {
    Order o = new Order();
    return repo.save(o);
  }

  @Transactional
  public Order markPaid(UUID id, String ref) {
    Order o = repo.findById(id).orElseThrow();
    o.pay(ref);
    repo.save(o);
    bus.publish(new OrderPaid(o.getId()));
    return o;
  }

  @Transactional
  public Order fulfill(UUID id, String tracking) {
    Order o = repo.findById(id).orElseThrow();
    o.fulfill(tracking);
    return repo.save(o);
  }

  @Transactional
  public Order cancel(UUID id, String reason) {
    Order o = repo.findById(id).orElseThrow();
    o.cancel(reason);
    return repo.save(o);
  }

}