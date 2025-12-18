package ro.baskitup.adapters.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthorsController {
  @GetMapping("/api/authors")
  public Map<String, Object> authors() {
    return Map.of("authors", "Prodan Mihai & Dumitru Vlad");
  }
}