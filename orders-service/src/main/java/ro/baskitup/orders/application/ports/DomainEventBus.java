package ro.baskitup.orders.application.ports;

public interface DomainEventBus {
  void publish(Object event);
}
