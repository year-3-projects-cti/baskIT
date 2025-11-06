package ro.baskitup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "ro.baskitup")
@EnableJpaRepositories(basePackages = "ro.baskitup.adapters.persistence")
@EntityScan(basePackages = "ro.baskitup.domain.model")
public class App {
  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
  }
}