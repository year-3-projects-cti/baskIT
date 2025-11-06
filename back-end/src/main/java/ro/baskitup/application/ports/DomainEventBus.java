package ro.baskitup.application.ports;

public interface DomainEventBus {
  void publish(Object event);
}