package ro.baskitup.adapters.events;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ro.baskitup.application.services.InventoryService;
import ro.baskitup.domain.events.OrderPaid;

@Component
public class InventoryHandler {
  private final InventoryService inventory;
  public InventoryHandler(InventoryService inventory) { this.inventory = inventory; }

  @EventListener
  public void on(OrderPaid e) {
    inventory.decrementForOrder(e.getOrderId().toString());
  }
}