package ro.baskitup.inventory.adapters.persistence;

import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedOrderRepository extends CrudRepository<ProcessedOrder, UUID> {
}
