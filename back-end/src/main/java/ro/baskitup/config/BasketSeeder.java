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
public class BasketSeeder implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(BasketSeeder.class);

  private final BasketRepository baskets;
  private final BasketService basketService;

  public BasketSeeder(BasketRepository baskets, BasketService basketService) {
    this.baskets = baskets;
    this.basketService = basketService;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (baskets.count() > 0) {
      return;
    }
    log.info("Seeding sample gift baskets");
    sampleData().forEach(basketService::create);
  }

  private List<BasketService.BasketRequest> sampleData() {
    return List.of(
        new BasketService.BasketRequest(
            "Crăciun Clasic",
            "craciun-clasic",
            "Crăciun",
            "Coș cadou perfect pentru magia sărbătorilor de iarnă",
            List.of("festiv", "tradițional", "premium"),
            new BigDecimal("249.99"),
            15,
            """
                <p>Un coș festiv plin cu delicatesele tradiționale ale sărbătorilor: ciocolată premium, nuci glazurate,
                vin spumos și decorațiuni elegante. Perfect pentru a împărți bucuria Crăciunului cu cei dragi.</p>
                <ul>
                  <li>Ciocolată artizanală belgiană 200g</li>
                  <li>Vin spumos Prosecco 750ml</li>
                  <li>Nuci caramelizate mix 150g</li>
                  <li>Biscuiți cu scorțișoară</li>
                  <li>Lumânare parfumată Crăciun</li>
                </ul>
                """,
            "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80"
        ),
        new BasketService.BasketRequest(
            "Love & Roses",
            "love-roses",
            "Valentine's",
            "Romantism și eleganță într-un singur cadou",
            List.of("romantic", "luxos", "exclusiv"),
            new BigDecimal("299.99"),
            8,
            """
                <p>Exprimă-ți dragostea cu acest coș luxos care combină trandafiri cu delicatese gourmet și surprize romantice.
                Include vin roșu premium și ciocolată artizanală.</p>
                <p><strong>Perfect pentru Valentine's Day.</strong></p>
                """,
            "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=80"
        ),
        new BasketService.BasketRequest(
            "Corporate Care Mini",
            "corporate-care-mini",
            "Corporate",
            "Apreciază echipa cu un cadou elegant",
            List.of("business", "elegant", "profesional"),
            new BigDecimal("149.99"),
            20,
            """
                <p>Coș corporate elegant, perfect pentru a arăta apreciere colegilor și partenerilor de business.
                Include snacks-uri premium, cafea de specialitate și accesorii de birou stilate.</p>
                """,
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
        ),
        new BasketService.BasketRequest(
            "Baby Welcome",
            "baby-welcome",
            "Baby & Părinți Noi",
            "Bucurie și răsfăț pentru cei mai mici",
            List.of("bebeluși", "organic", "delicat"),
            new BigDecimal("189.99"),
            12,
            """
                <p>Întâmpină noul membru al familiei cu un coș plin de produse premium pentru bebeluși și delicatesuri pentru părinți.
                Include jucării de pluș hipoalergenice și produse de îngrijire organice.</p>
                """,
            "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80"
        )
    );
  }
}
