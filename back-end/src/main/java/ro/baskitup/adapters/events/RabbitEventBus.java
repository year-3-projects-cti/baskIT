package ro.baskitup.adapters.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ro.baskitup.application.ports.DomainEventBus;
import ro.baskitup.domain.events.OrderPaid;

@Component
public class RabbitEventBus implements DomainEventBus {
  private static final Logger log = LoggerFactory.getLogger(RabbitEventBus.class);

  private final RabbitTemplate rabbitTemplate;
  private final String orderPaidQueue;

  public RabbitEventBus(RabbitTemplate rabbitTemplate,
                        @Value("${app.rabbitmq.order-paid-queue}") String orderPaidQueue) {
    this.rabbitTemplate = rabbitTemplate;
    this.rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
    this.orderPaidQueue = orderPaidQueue;
  }

  @Override
  public void publish(Object event) {
    if (event instanceof OrderPaid op) {
      rabbitTemplate.convertAndSend(orderPaidQueue, op);
      log.debug("Published OrderPaid {} to queue {}", op.getOrderId(), orderPaidQueue);
    } else {
      log.warn("Ignoring unsupported event type on bus: {}", event.getClass().getSimpleName());
    }
  }
}
