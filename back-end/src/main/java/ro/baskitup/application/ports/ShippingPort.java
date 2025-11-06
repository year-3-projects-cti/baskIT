package ro.baskitup.application.ports;

import java.util.UUID;

public interface ShippingPort {
  String createLabel(UUID orderId);
  String registerTracking(UUID orderId, String label);
}