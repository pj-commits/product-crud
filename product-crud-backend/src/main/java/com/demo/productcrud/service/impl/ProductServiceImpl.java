package com.demo.productcrud.service.impl;

import com.demo.productcrud.dto.ListQueryParams;
import com.demo.productcrud.dto.ProductDTO;
import com.demo.productcrud.entity.Product;
import com.demo.productcrud.enums.ProductStatus;
import com.demo.productcrud.repository.ProductRepository;
import com.demo.productcrud.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Page<ProductDTO> getAll(ListQueryParams params) {
        Sort sort = params.getSortOrder().equalsIgnoreCase("asc")
                ? Sort.by(params.getSortBy()).ascending()
                : Sort.by(params.getSortBy()).descending();

        Pageable pageable = PageRequest.of(params.getPageIndex(), params.getPageSize(), sort);

        return productRepository.findByTitleContainingIgnoreCase(params.getKeywordFilter(), pageable)
                .map(this::toDTO);
    }

    @Override
    public ProductDTO getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return toDTO(product);
    }

    @Override
    public ProductDTO create(ProductDTO dto) {
        Product product = toEntity(dto);
        return toDTO(productRepository.save(product));
    }

    @Override
    public ProductDTO update(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setStatus(determineStatus(dto.getPieces()));
        product.setPieces(dto.getPieces());
        return toDTO(productRepository.save(product));
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    private ProductStatus determineStatus(Integer pieces) {
        if (pieces == null || pieces == 0) return ProductStatus.NOT_AVAILABLE;
        if (pieces <= 10) return ProductStatus.LOW_STOCK;
        return ProductStatus.AVAILABLE;
    }

    private ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getStatus(),
                product.getPieces()
        );
    }

    private Product toEntity(ProductDTO dto) {
        return new Product(
                null,
                dto.getTitle(),
                dto.getDescription(),
                determineStatus(dto.getPieces()),
                dto.getPieces(),
                null,
                null
        );
    }
}