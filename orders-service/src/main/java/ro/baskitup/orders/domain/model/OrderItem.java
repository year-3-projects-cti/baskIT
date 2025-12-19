package ro.baskitup.orders.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
public class OrderItem {

  @Id
  @GeneratedValue
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_id")
  private Order order;

  @Column(name = "basket_id", nullable = false)
  private UUID basketId;

  @Column(nullable = false)
  private String titleSnapshot;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal unitAmount;

  @Column(nullable = false)
  private Integer quantity;

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public Order getOrder() { return order; }
  public void setOrder(Order order) { this.order = order; }
  public UUID getBasketId() { return basketId; }
  public void setBasketId(UUID basketId) { this.basketId = basketId; }
  public String getTitleSnapshot() { return titleSnapshot; }
  public void setTitleSnapshot(String titleSnapshot) { this.titleSnapshot = titleSnapshot; }
  public BigDecimal getUnitAmount() { return unitAmount; }
  public void setUnitAmount(BigDecimal unitAmount) { this.unitAmount = unitAmount; }
  public Integer getQuantity() { return quantity; }
  public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
