package ro.baskitup.inventory.application.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.baskitup.inventory.adapters.persistence.ProcessedOrder;
import ro.baskitup.inventory.adapters.persistence.ProcessedOrderRepository;

@Service
public class InventoryService {
  private final ProcessedOrderRepository repo;

  public InventoryService(ProcessedOrderRepository repo) {
    this.repo = repo;
  }

  @Transactional
  public void recordOrder(UUID orderId) {
    repo.save(new ProcessedOrder(orderId));
  }

  @Transactional(readOnly = true)
  public List<ProcessedOrder> listProcessed() {
    List<ProcessedOrder> out = new ArrayList<>();
    repo.findAll().forEach(out::add);
    return out;
  }
}
