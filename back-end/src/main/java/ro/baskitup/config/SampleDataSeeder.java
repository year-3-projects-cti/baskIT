package ro.baskitup.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import ro.baskitup.adapters.persistence.BasketRepository;
import ro.baskitup.application.services.BasketService;

import java.math.BigDecimal;
import java.util.List;

@Component
public class SampleDataSeeder implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(SampleDataSeeder.class);

  private final BasketRepository baskets;
  private final BasketService basketService;

  public SampleDataSeeder(BasketRepository baskets, BasketService basketService) {
    this.baskets = baskets;
    this.basketService = basketService;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (baskets.count() > 0) {
      return;
    }
    log.info("Seeding sample baskets for demo/testing");
    List<BasketService.BasketRequest> seedData = List.of(
        new BasketService.BasketRequest(
            "Crăciun Magic",
            "craciun-magic",
            "Sărbători",
            "Coș festiv cu vin fiert, prăjituri tradiționale și lumânărele parfumate.",
            List.of("Craciun", "Holiday", "Winter"),
            new BigDecimal("329.90"),
            18,
            "<p>Include vin roșu fiert, cozonac artizanal, fursecuri cu scorțișoară, gem de merișoare și decorațiuni cu brad.</p>",
            "https://images.unsplash.com/photo-1518051870910-a46e30d9db16"
        ),
        new BasketService.BasketRequest(
            "Valentine Rose",
            "valentine-rose",
            "Valentine's Day",
            "Cadou romantic cu prosecco, trufe belgiene și lumânări parfumate.",
            List.of("Valentine", "Love", "Romantic"),
            new BigDecimal("279.00"),
            22,
            "<p>Perfect pentru surprize romantice: prosecco italian, ciocolată Premium, lumânăre parfumată și flori presate.</p>",
            "https://images.unsplash.com/photo-1486427944299-d1955d23e34d"
        ),
        new BasketService.BasketRequest(
            "Brunch de Paște",
            "brunch-de-paste",
            "Paște",
            "Selecție de bunătăți cu cozonac, praline și decorațiuni de primăvară.",
            List.of("Paste", "Easter", "Primavara"),
            new BigDecimal("249.50"),
            16,
            "<p>Include cozonac cu nucă, vin alb aromat, ouă decorative pictate și un iepuraș ceramic.</p>",
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e"
        ),
        new BasketService.BasketRequest(
            "Corporate Class",
            "corporate-class",
            "Corporate",
            "Cadou premium cu vin roșu, cafea de specialitate și notebook din piele.",
            List.of("Corporate", "Business", "Premium"),
            new BigDecimal("399.00"),
            30,
            "<p>Ideal pentru clienți importanți: vin roșu DOC, cafea prăjită local, jurnal din piele și praline.</p>",
            "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc"
        ),
        new BasketService.BasketRequest(
            "Spa & Relax",
            "spa-relax",
            "Wellness",
            "Pachet cu produse spa naturale, ceaiuri calmante și lumânări.",
            List.of("Relaxare", "Wellness", "Spa"),
            new BigDecimal("219.99"),
            24,
            "<p>Include scrub cu sare de Himalaya, ulei esențial de lavandă, lumânări și ceai organic.</p>",
            "https://images.unsplash.com/photo-1508717272800-9fff97da7e8f"
        ),
        new BasketService.BasketRequest(
            "Gust de Transilvania",
            "gust-de-transilvania",
            "Tradițional",
            "Selecție de produse artizanale românești cu dulceață, zacuscă și siropuri.",
            List.of("Traditional", "Romania", "Artizanal"),
            new BigDecimal("189.90"),
            40,
            "<p>Dulceață de afine, miere cu nuci, zacuscă de hribi și sirop de cătină din Apuseni.</p>",
            "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0"
        )
    );
    seedData.forEach(basketService::create);
    log.info("Sample baskets added.");
  }
}
