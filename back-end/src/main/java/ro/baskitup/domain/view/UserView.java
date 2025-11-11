package ro.baskitup.domain.view;

import ro.baskitup.domain.model.UserRole;

import java.util.UUID;

public record UserView(
    UUID id,
    String email,
    String name,
    UserRole role
) {
}
