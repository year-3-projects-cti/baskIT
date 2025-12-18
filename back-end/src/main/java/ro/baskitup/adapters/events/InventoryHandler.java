package ro.baskitup.adapters.events;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import ro.baskitup.application.services.InventoryService;
import ro.baskitup.domain.events.OrderPaid;

@Component
public class InventoryHandler {
  private final InventoryService inventory;
  public InventoryHandler(InventoryService inventory) { this.inventory = inventory; }

  @RabbitListener(queues = "${app.rabbitmq.order-paid-queue}")
  public void on(OrderPaid e) {
    // Asynchronously consume OrderPaid events and update stock
    inventory.decrementForOrder(e.getOrderId().toString());
  }
}
