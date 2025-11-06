package ro.baskitup.adapters.events;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import ro.baskitup.application.ports.DomainEventBus;

@Component
public class SpringEventBus implements DomainEventBus {
  private final ApplicationEventPublisher publisher;
  public SpringEventBus(ApplicationEventPublisher publisher) { this.publisher = publisher; }
  @Override public void publish(Object event) { publisher.publishEvent(event); }
}