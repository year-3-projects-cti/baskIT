package ro.baskitup.orders.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
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

  @Column(name = "order_number", unique = true)
  private String orderNumber;

  @Column(name = "customer_name")
  private String customerName;

  @Column(name = "customer_email")
  private String customerEmail;

  @Column(name = "customer_phone")
  private String customerPhone;

  @Embedded
  private ShippingAddress shippingAddress;

  @Column(name = "gift_note", length = 512)
  private String giftNote;

  @Column(name = "client_key", length = 160)
  private String clientKey;
  @Column(name = "user_key", length = 160)
  private String userKey;

  @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
  private BigDecimal totalAmount = BigDecimal.ZERO;

  @Column(name = "vat_amount", precision = 10, scale = 2, nullable = false)
  private BigDecimal vatAmount = BigDecimal.ZERO;

  @Column(name = "shipping_fee", precision = 10, scale = 2, nullable = false)
  private BigDecimal shippingFee = BigDecimal.ZERO;

  @Column(length = 3, nullable = false)
  private String currency = "RON";

  @Column(name = "payment_intent_id")
  private String paymentIntentId;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @JsonIgnore
  private List<OrderItem> items = new ArrayList<>();

  public Order() {
    this.id = UUID.randomUUID();
    this.status = OrderStatus.CREATED;
  }

  @PrePersist
  void onCreate() {
    if (this.createdAt == null) {
      this.createdAt = Instant.now();
    }
    if (this.orderNumber == null) {
      this.orderNumber = "BK-" + this.createdAt.toEpochMilli();
    }
  }

  public void addItem(OrderItem item) {
    item.setOrder(this);
    this.items.add(item);
  }

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
  public String getOrderNumber() { return orderNumber; }
  public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
  public String getCustomerName() { return customerName; }
  public void setCustomerName(String customerName) { this.customerName = customerName; }
  public String getCustomerEmail() { return customerEmail; }
  public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
  public String getCustomerPhone() { return customerPhone; }
  public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
  public ShippingAddress getShippingAddress() { return shippingAddress; }
  public void setShippingAddress(ShippingAddress shippingAddress) { this.shippingAddress = shippingAddress; }
  public String getGiftNote() { return giftNote; }
  public void setGiftNote(String giftNote) { this.giftNote = giftNote; }
  public String getClientKey() { return clientKey; }
  public void setClientKey(String clientKey) { this.clientKey = clientKey; }
  public String getUserKey() { return userKey; }
  public void setUserKey(String userKey) { this.userKey = userKey; }
  public BigDecimal getTotalAmount() { return totalAmount; }
  public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
  public BigDecimal getVatAmount() { return vatAmount; }
  public void setVatAmount(BigDecimal vatAmount) { this.vatAmount = vatAmount; }
  public BigDecimal getShippingFee() { return shippingFee; }
  public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }
  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }
  public String getPaymentIntentId() { return paymentIntentId; }
  public void setPaymentIntentId(String paymentIntentId) { this.paymentIntentId = paymentIntentId; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public List<OrderItem> getItems() { return items; }
  public void setItems(List<OrderItem> items) { this.items = items; }
}
