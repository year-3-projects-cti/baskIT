package ro.baskitup.application.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import ro.baskitup.adapters.persistence.BasketEntity;
import ro.baskitup.adapters.persistence.BasketRepository;

@Service
@Transactional(readOnly = true)
public class CartService {

  private final BasketRepository baskets;
  private final BigDecimal vatRate;

  private static final BigDecimal STANDARD_SHIPPING = BigDecimal.valueOf(25);
  private static final BigDecimal EXPRESS_SHIPPING = BigDecimal.valueOf(35);

  public CartService(BasketRepository baskets, @Value("${app.vat-rate:0.19}") BigDecimal vatRate) {
    this.baskets = baskets;
    this.vatRate = vatRate;
  }

  public EstimateResult estimate(List<CartItemRequest> items, ShippingMethod method) {
    if (CollectionUtils.isEmpty(items)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Coșul este gol");
    }

    List<EstimateLine> lines = items.stream()
        .map(req -> {
          BasketEntity basket = baskets.findById(req.basketId())
              .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coșul nu există"));
          if (req.quantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cantitatea trebuie să fie pozitivă");
          }
          if (basket.getStock() < req.quantity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Stoc insuficient pentru " + basket.getTitle());
          }
          BigDecimal lineTotal = basket.getPrice().multiply(BigDecimal.valueOf(req.quantity()));
          return new EstimateLine(
              basket.getId(),
              basket.getSlug(),
              basket.getTitle(),
              basket.getPrice(),
              req.quantity(),
              lineTotal
          );
        })
        .collect(Collectors.toList());

    BigDecimal subtotal = lines.stream()
        .map(EstimateLine::lineTotal)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal shipping = method == ShippingMethod.EXPRESS ? EXPRESS_SHIPPING : STANDARD_SHIPPING;
    BigDecimal vat = subtotal.add(shipping).multiply(vatRate).setScale(2, RoundingMode.HALF_UP);
    BigDecimal total = subtotal.add(shipping).add(vat).setScale(2, RoundingMode.HALF_UP);

    return new EstimateResult(lines, subtotal, shipping, vat, total, vatRate);
  }

  public enum ShippingMethod {
    STANDARD,
    EXPRESS;

    public static ShippingMethod from(String value) {
      if (!StringUtils.hasText(value)) {
        return STANDARD;
      }
      return "express".equalsIgnoreCase(value) ? EXPRESS : STANDARD;
    }
  }

  public record CartItemRequest(UUID basketId, int quantity) {}

  public record EstimateLine(
      UUID basketId,
      String slug,
      String title,
      BigDecimal unitPrice,
      int quantity,
      BigDecimal lineTotal
  ) {}

  public record EstimateResult(
      List<EstimateLine> lines,
      BigDecimal subtotal,
      BigDecimal shipping,
      BigDecimal vat,
      BigDecimal total,
      BigDecimal vatRate
  ) {}
}
