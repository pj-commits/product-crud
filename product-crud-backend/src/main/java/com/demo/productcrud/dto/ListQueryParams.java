package com.demo.productcrud.dto;

import lombok.*;

@Data
public class ListQueryParams {
    private int pageIndex = 0;
    private int pageSize = 10;
    private String sortBy = "title";
    private String sortOrder = "asc";
    private String keywordFilter = "";
}
