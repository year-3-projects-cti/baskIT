package ro.baskitup.orders.adapters.persistence;

import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ro.baskitup.orders.domain.model.Order;

@Repository
public interface OrderRepository extends CrudRepository<Order, UUID> {
}
