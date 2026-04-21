# Product CRUD
A simple product CRUD app built with Spring Boot and vanilla HTML/Bootstrap. This is in compliance with [CRUD Product App Requirements](https://github.com/starpaycorporation/Product-Inventory-Application)

## Setup requirements:
* Java 17+
* Maven 3.x
* MySQL 8.x
* VS Code with Live Server for FE

## Backend Setup

1. Clone the project and open it in IntelliJ IDEA.
2. Create a MySQL database:
3. sql   CREATE DATABASE db_productcrud;
4. Update `src/main/resources/application.properties` with your MySQL credentials:
```
properties   spring.datasource.url=jdbc:mysql://localhost:3306/db_productcrud
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
```

5. Run the application. The table will be created automatically.
6. Backend runs on: http://localhost:8080


## Frontend Setup

1. Open the frontend folder and make sure the backend is running also.
2. Open index.html directly in your browser.
3. Open Live Server on VS Code.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (paginated) |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

### Query Parameters (GET all)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `pageIndex` | `0` | Page number (0-based) |
| `pageSize` | `10` | Items per page |
| `sortBy` | `title` | Field to sort by |
| `sortOrder` | `asc` | `asc` or `desc` |
| `keywordFilter` | `` | Search by title |

---

## Status Logic

Status is automatically determined based on pieces — no manual input needed.

| Pieces | Status |
|--------|--------|
| 0 or null | NOT AVAILABLE |
| 1 - 10 | LOW STOCK |
| 11+ | AVAILABLE |