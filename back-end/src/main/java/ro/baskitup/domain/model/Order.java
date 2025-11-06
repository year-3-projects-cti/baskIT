package ro.baskitup.domain.model;

import jakarta.persistence.*;
import ro.baskitup.domain.state.CreatedState;
import ro.baskitup.domain.state.OrderState;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {
  @Id
  private UUID id;
  @Enumerated(EnumType.STRING)
  private OrderStatus status;
  private String paymentRef;
  private String trackingNumber;
  private String cancelReason;

  @Transient
  @JsonIgnore
  private OrderState state;

  public Order() {
    this.id = UUID.randomUUID();
    this.status = OrderStatus.CREATED;
    this.state = new CreatedState();
  }

  @PostLoad
  public void initState() {
    switch (status) {
      case CREATED -> this.state = new ro.baskitup.domain.state.CreatedState();
      case PAID -> this.state = new ro.baskitup.domain.state.PaidState();
      case FULFILLED -> this.state = new ro.baskitup.domain.state.FulfilledState();
      case CANCELED -> this.state = new ro.baskitup.domain.state.CanceledState();
    }
  }

  public void pay(String paymentRef) { state.pay(this, paymentRef); }
  public void fulfill(String trackingNumber) { state.fulfill(this, trackingNumber); }
  public void cancel(String reason) { state.cancel(this, reason); }

  // getters/setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public OrderStatus getStatus() { return status; }
  public void setStatus(OrderStatus status) { this.status = status; }
  public String getPaymentRef() { return paymentRef; }
  public void setPaymentRef(String paymentRef) { this.paymentRef = paymentRef; }
  public String getTrackingNumber() { return trackingNumber; }
  public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
  public String getCancelReason() { return cancelReason; }
  public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
  public OrderState getState() { return state; }
  public void setState(OrderState state) { this.state = state; }
  
}