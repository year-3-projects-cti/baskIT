package ro.baskitup.adapters.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.baskitup.domain.model.Order;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> { }