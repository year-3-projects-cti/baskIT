package ro.baskitup.adapters.shipping;

import org.springframework.stereotype.Component;
import ro.baskitup.application.ports.ShippingPort;

import java.util.UUID;

@Component
public class FakeShippingAdapter implements ShippingPort {
  @Override public String createLabel(UUID orderId) { return "LBL-" + orderId; }
  @Override public String registerTracking(UUID orderId, String label) { return "TRK-" + orderId; }
}