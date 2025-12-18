package ro.baskitup.application.services;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class InventoryService {
  private static final Logger log = LoggerFactory.getLogger(InventoryService.class);
  public void decrementForOrder(String info) {
    log.info("Inventory decremented for order {}", info);
  }
}
