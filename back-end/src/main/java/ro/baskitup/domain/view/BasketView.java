package ro.baskitup.domain.view;

public class BasketView {
  private Long id;
  private String name;
  private int priceRon;
  private int stock;

  public BasketView() { }
  public BasketView(Long id, String name, int priceRon, int stock) {
    this.id = id; this.name = name; this.priceRon = priceRon; this.stock = stock;
  }
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public int getPriceRon() { return priceRon; }
  public void setPriceRon(int priceRon) { this.priceRon = priceRon; }
  public int getStock() { return stock; }
  public void setStock(int stock) { this.stock = stock; }
}