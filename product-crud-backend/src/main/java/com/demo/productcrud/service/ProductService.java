package com.demo.productcrud.service;

import com.demo.productcrud.dto.ListQueryParams;
import com.demo.productcrud.dto.ProductDTO;
import org.springframework.data.domain.*;

public interface ProductService {
    Page<ProductDTO> getAll(ListQueryParams params);
    ProductDTO getById(Long id);
    ProductDTO create(ProductDTO dto);
    ProductDTO update(Long id, ProductDTO dto);
    void delete(Long id);
}