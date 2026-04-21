package com.demo.productcrud;

import com.demo.productcrud.entity.Product;
import com.demo.productcrud.enums.ProductStatus;
import com.demo.productcrud.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            productRepository.save(new Product(null, "Orange", "An orange fruit.", ProductStatus.AVAILABLE, 100, null, null));
            productRepository.save(new Product(null, "Apple", "A red fruit.", ProductStatus.LOW_STOCK, 5, null, null));
            productRepository.save(new Product(null, "Grape", "A purple fruit.", ProductStatus.NOT_AVAILABLE, 0, null, null));
        }
    }
}