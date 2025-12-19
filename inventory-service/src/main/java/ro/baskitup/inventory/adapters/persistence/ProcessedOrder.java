package ro.baskitup.inventory.adapters.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "processed_orders")
public class ProcessedOrder {
  @Id
  private UUID id;

  @Column(name = "processed_at", nullable = false)
  private Instant processedAt;

  public ProcessedOrder() {
    this.id = UUID.randomUUID();
    this.processedAt = Instant.now();
  }

  public ProcessedOrder(UUID orderId) {
    this.id = orderId;
    this.processedAt = Instant.now();
  }

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public Instant getProcessedAt() { return processedAt; }
  public void setProcessedAt(Instant processedAt) { this.processedAt = processedAt; }
}
