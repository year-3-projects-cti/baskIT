package ro.baskitup.application.services;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.baskitup.adapters.persistence.OrderRepository;
import ro.baskitup.application.ports.PaymentPort;
import ro.baskitup.application.services.CartService.CartItemRequest;
import ro.baskitup.application.services.CartService.EstimateLine;
import ro.baskitup.application.services.CartService.EstimateResult;
import ro.baskitup.application.services.CartService.ShippingMethod;
import ro.baskitup.domain.model.Order;
import ro.baskitup.domain.model.OrderItem;
import ro.baskitup.domain.model.ShippingAddress;

@Service
public class CheckoutService {
  private final OrderRepository orders;
  private final CartService cartService;
  private final PaymentPort paymentPort;

  public CheckoutService(OrderRepository orders, CartService cartService, PaymentPort paymentPort) {
    this.orders = orders;
    this.cartService = cartService;
    this.paymentPort = paymentPort;
  }

  @Transactional
  public CheckoutResponse initCheckout(CheckoutRequest request) {
    ShippingMethod method = ShippingMethod.from(request.shippingMethod());
    EstimateResult estimate = cartService.estimate(request.items().stream()
        .map(item -> new CartItemRequest(item.basketId(), item.quantity()))
        .toList(), method);

    Order order = new Order();
    order.setCustomerName(request.firstName().trim() + " " + request.lastName().trim());
    order.setCustomerEmail(request.email().trim().toLowerCase());
    order.setCustomerPhone(request.phone());
    order.setGiftNote(request.giftMessage());
    order.setShippingAddress(new ShippingAddress(
        request.address().line1(),
        request.address().line2(),
        request.address().city(),
        request.address().county(),
        request.address().postalCode()
    ));
    order.setShippingFee(estimate.shipping());
    order.setVatAmount(estimate.vat());
    order.setTotalAmount(estimate.total());
    order.setCurrency("RON");

    for (EstimateLine line : estimate.lines()) {
      OrderItem item = new OrderItem();
      item.setBasketId(line.basketId());
      item.setQuantity(line.quantity());
      item.setTitleSnapshot(line.title());
      item.setUnitAmount(line.unitPrice());
      order.addItem(item);
    }

    Order saved = orders.save(order);

    int amountMinorUnits = estimate.total().multiply(BigDecimal.valueOf(100))
        .setScale(0, RoundingMode.HALF_UP).intValueExact();
    String clientSecret = paymentPort.createPaymentIntent(saved.getId(), amountMinorUnits);
    saved.setPaymentIntentId(clientSecret);
    orders.save(saved);
    return new CheckoutResponse(saved.getId(), saved.getOrderNumber(), clientSecret);
  }

  public record CheckoutResponse(UUID orderId, String orderNumber, String clientSecret) {}

  public record CheckoutRequest(
      @NotBlank @Size(max = 50) String firstName,
      @NotBlank @Size(max = 50) String lastName,
      @NotBlank @Email String email,
      @NotBlank @Size(max = 20) String phone,
      @NotNull @Valid AddressDto address,
      @Size(max = 20) String shippingMethod,
      @Size(max = 512) String giftMessage,
      @NotNull List<@Valid CheckoutItem> items
  ) {}

  public record AddressDto(
      @NotBlank @Size(max = 160) String line1,
      @Size(max = 160) String line2,
      @NotBlank @Size(max = 80) String city,
      @NotBlank @Size(max = 80) String county,
      @NotBlank @Size(max = 16) String postalCode
  ) {}

  public record CheckoutItem(
      @NotNull UUID basketId,
      @Positive int quantity
  ) {}
}
