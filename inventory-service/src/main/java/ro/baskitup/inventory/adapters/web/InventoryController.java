package ro.baskitup.inventory.adapters.web;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.baskitup.inventory.adapters.persistence.ProcessedOrder;
import ro.baskitup.inventory.application.services.InventoryService;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
  private final InventoryService inventory;

  public InventoryController(InventoryService inventory) {
    this.inventory = inventory;
  }

  @GetMapping("/processed")
  public List<ProcessedOrder> processed() {
    return inventory.listProcessed();
  }
}
