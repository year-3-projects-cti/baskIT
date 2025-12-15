package ro.baskitup.adapters.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.baskitup.application.services.CartService;
import ro.baskitup.application.services.CartService.CartItemRequest;
import ro.baskitup.application.services.CartService.EstimateResult;
import ro.baskitup.application.services.CartService.ShippingMethod;
import ro.baskitup.application.services.CheckoutService;
import ro.baskitup.application.services.CheckoutService.CheckoutRequest;
import ro.baskitup.application.services.CheckoutService.CheckoutResponse;

@RestController
@RequestMapping("/api")
public class CheckoutController {
  private final CheckoutService checkout;
  private final CartService cartService;

  public CheckoutController(CheckoutService checkout, CartService cartService) {
    this.checkout = checkout;
    this.cartService = cartService;
  }

  @PostMapping("/cart/estimate")
  public EstimateResult estimate(@Valid @RequestBody EstimateRequest request) {
    return cartService.estimate(
        request.items().stream().map(i -> new CartItemRequest(i.basketId(), i.quantity())).toList(),
        ShippingMethod.from(request.shippingMethod())
    );
  }

  @PostMapping("/checkout/session")
  public CheckoutResponse session(@Valid @RequestBody CheckoutRequest request) {
    return checkout.initCheckout(request);
  }

  public record EstimateRequest(
      @NotEmpty @Valid java.util.List<CartItem> items,
      String shippingMethod
  ) {}

  public record CartItem(
      @NotNull java.util.UUID basketId,
      @Positive int quantity
  ) {}
}
