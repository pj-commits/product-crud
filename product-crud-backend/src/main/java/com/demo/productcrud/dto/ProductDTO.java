package com.demo.productcrud.dto;

import com.demo.productcrud.enums.ProductStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;
    private String title;
    private String description;
    private ProductStatus status;
    private Integer pieces;
}