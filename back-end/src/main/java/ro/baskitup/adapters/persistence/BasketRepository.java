package ro.baskitup.adapters.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BasketRepository extends JpaRepository<BasketEntity, UUID> {
  Optional<BasketEntity> findBySlugIgnoreCase(String slug);

  Optional<BasketEntity> findBySlugIgnoreCaseAndIdNot(String slug, UUID id);

  boolean existsBySlugIgnoreCase(String slug);
}
