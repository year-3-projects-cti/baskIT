package ro.baskitup.inventory.adapters.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import ro.baskitup.inventory.application.services.InventoryService;
import ro.baskitup.inventory.domain.events.OrderPaid;

@Component
public class OrderPaidListener {
  private static final Logger log = LoggerFactory.getLogger(OrderPaidListener.class);
  private final InventoryService inventory;

  public OrderPaidListener(InventoryService inventory) {
    this.inventory = inventory;
  }

  @RabbitListener(queues = "${app.rabbitmq.order-paid-queue}")
  public void on(OrderPaid event) {
    log.info("Inventory service received OrderPaid {}", event.getOrderId());
    inventory.recordOrder(event.getOrderId());
  }
}
