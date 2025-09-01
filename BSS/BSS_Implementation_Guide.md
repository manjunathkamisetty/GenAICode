# BSS Implementation Guide
## Step-by-Step Guide to Building CRM, Billing, Order Management, and Product Catalog Systems

## 🚀 **Getting Started**

### **Prerequisites**
- Java 11+ or Python 3.8+
- Docker and Docker Compose
- PostgreSQL 13+
- Redis 6+
- Apache Kafka 2.8+
- Node.js 16+ (for frontend)

### **Project Structure**
```
bss-implementation/
├── backend/
│   ├── customer-service/
│   ├── product-service/
│   ├── order-service/
│   ├── billing-service/
│   └── shared/
├── frontend/
│   ├── customer-portal/
│   ├── agent-desktop/
│   └── mobile-app/
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
├── docs/
└── scripts/
```

## 🔧 **Step 1: Set Up Infrastructure**

### **Docker Compose Setup**
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: bss_db
      POSTGRES_USER: bss_user
      POSTGRES_PASSWORD: bss_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
  
  kafka:
    image: confluentinc/cp-kafka:6.2.0
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper
  
  zookeeper:
    image: confluentinc/cp-zookeeper:6.2.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
  
  kong:
    image: kong:2.5
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
      KONG_PG_USER: kong_user
      KONG_PG_PASSWORD: kong_password
    ports:
      - "8000:8000"
      - "8443:8443"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### **Database Schema Setup**
```sql
-- Create databases
CREATE DATABASE customer_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE billing_db;

-- Create shared schemas
CREATE SCHEMA IF NOT EXISTS shared;

-- Create customer tables
\c customer_db;
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    customer_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product tables
\c product_db;
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    product_type VARCHAR(50),
    base_price DECIMAL(19,2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order tables
\c order_db;
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'CREATED',
    total_amount DECIMAL(19,2),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create billing tables
\c billing_db;
CREATE TABLE billing_accounts (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    account_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🏗️ **Step 2: Build Core Services**

### **Customer Service Implementation**

#### **Maven Configuration**
```xml
<!-- customer-service/pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.bss</groupId>
    <artifactId>customer-service</artifactId>
    <version>1.0.0</version>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.0</version>
    </parent>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>
    </dependencies>
</project>
```

#### **Application Properties**
```properties
# customer-service/src/main/resources/application.yml
spring:
  application:
    name: customer-service
  
  datasource:
    url: jdbc:postgresql://localhost:5432/customer_db
    username: bss_user
    password: bss_password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  
  redis:
    host: localhost
    port: 6379
  
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: customer-service-group
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer

server:
  port: 8081
```

#### **Main Application Class**
```java
// customer-service/src/main/java/com/bss/customer/CustomerServiceApplication.java
package com.bss.customer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableJpaRepositories
@EnableKafka
public class CustomerServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CustomerServiceApplication.class, args);
    }
}
```

#### **Customer Controller**
```java
// customer-service/src/main/java/com/bss/customer/controller/CustomerController.java
package com.bss.customer.controller;

import com.bss.customer.dto.CreateCustomerRequest;
import com.bss.customer.dto.CustomerResponse;
import com.bss.customer.dto.UpdateCustomerRequest;
import com.bss.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@CrossOrigin(origins = "*")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CreateCustomerRequest request) {
        CustomerResponse customer = customerService.createCustomer(request);
        return ResponseEntity.ok(customer);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomer(@PathVariable Long id) {
        CustomerResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request) {
        CustomerResponse customer = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(customer);
    }
    
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> searchCustomers(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String email) {
        List<CustomerResponse> customers = customerService.searchCustomers(firstName, lastName, email);
        return ResponseEntity.ok(customers);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
```

#### **Customer Service Implementation**
```java
// customer-service/src/main/java/com/bss/customer/service/CustomerService.java
package com.bss.customer.service;

import com.bss.customer.dto.CreateCustomerRequest;
import com.bss.customer.dto.CustomerResponse;
import com.bss.customer.dto.UpdateCustomerRequest;
import com.bss.customer.entity.Customer;
import com.bss.customer.repository.CustomerRepository;
import com.bss.customer.event.CustomerEventPublisher;
import com.bss.customer.exception.CustomerNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private CustomerEventPublisher eventPublisher;
    
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        // Validate customer data
        validateCustomerData(request);
        
        // Create customer entity
        Customer customer = Customer.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .customerType(request.getCustomerType())
            .status("ACTIVE")
            .createdDate(LocalDateTime.now())
            .build();
        
        // Save customer
        Customer savedCustomer = customerRepository.save(customer);
        
        // Publish customer created event
        eventPublisher.publishCustomerCreated(savedCustomer);
        
        return mapToResponse(savedCustomer);
    }
    
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException(id));
        return mapToResponse(customer);
    }
    
    public CustomerResponse updateCustomer(Long id, UpdateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException(id));
        
        // Update customer fields
        if (request.getFirstName() != null) {
            customer.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            customer.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            customer.setPhone(request.getPhone());
        }
        
        customer.setLastModifiedDate(LocalDateTime.now());
        
        Customer updatedCustomer = customerRepository.save(customer);
        
        // Publish customer updated event
        eventPublisher.publishCustomerUpdated(updatedCustomer);
        
        return mapToResponse(updatedCustomer);
    }
    
    public List<CustomerResponse> searchCustomers(String firstName, String lastName, String email) {
        List<Customer> customers = customerRepository.findBySearchCriteria(firstName, lastName, email);
        return customers.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new CustomerNotFoundException(id));
        
        customer.setStatus("INACTIVE");
        customer.setLastModifiedDate(LocalDateTime.now());
        
        customerRepository.save(customer);
        
        // Publish customer deleted event
        eventPublisher.publishCustomerDeleted(customer);
    }
    
    private void validateCustomerData(CreateCustomerRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
    }
    
    private CustomerResponse mapToResponse(Customer customer) {
        return CustomerResponse.builder()
            .id(customer.getId())
            .firstName(customer.getFirstName())
            .lastName(customer.getLastName())
            .email(customer.getEmail())
            .phone(customer.getPhone())
            .customerType(customer.getCustomerType())
            .status(customer.getStatus())
            .createdDate(customer.getCreatedDate())
            .lastModifiedDate(customer.getLastModifiedDate())
            .build();
    }
}
```

## 🛠️ **Step 3: Implement Event-Driven Architecture**

### **Event Publisher**
```java
// customer-service/src/main/java/com/bss/customer/event/CustomerEventPublisher.java
package com.bss.customer.event;

import com.bss.customer.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class CustomerEventPublisher {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String CUSTOMER_TOPIC = "customer-events";
    
    public void publishCustomerCreated(Customer customer) {
        CustomerEvent event = CustomerEvent.builder()
            .eventType("CUSTOMER_CREATED")
            .customerId(customer.getId())
            .timestamp(System.currentTimeMillis())
            .data(customer)
            .build();
        
        kafkaTemplate.send(CUSTOMER_TOPIC, event);
    }
    
    public void publishCustomerUpdated(Customer customer) {
        CustomerEvent event = CustomerEvent.builder()
            .eventType("CUSTOMER_UPDATED")
            .customerId(customer.getId())
            .timestamp(System.currentTimeMillis())
            .data(customer)
            .build();
        
        kafkaTemplate.send(CUSTOMER_TOPIC, event);
    }
    
    public void publishCustomerDeleted(Customer customer) {
        CustomerEvent event = CustomerEvent.builder()
            .eventType("CUSTOMER_DELETED")
            .customerId(customer.getId())
            .timestamp(System.currentTimeMillis())
            .data(customer)
            .build();
        
        kafkaTemplate.send(CUSTOMER_TOPIC, event);
    }
}
```

### **Event Consumer**
```java
// customer-service/src/main/java/com/bss/customer/event/CustomerEventConsumer.java
package com.bss.customer.event;

import com.bss.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class CustomerEventConsumer {
    
    @Autowired
    private CustomerService customerService;
    
    @KafkaListener(topics = "customer-events", groupId = "customer-service-group")
    public void handleCustomerEvent(CustomerEvent event) {
        switch (event.getEventType()) {
            case "CUSTOMER_CREATED":
                handleCustomerCreated(event);
                break;
            case "CUSTOMER_UPDATED":
                handleCustomerUpdated(event);
                break;
            case "CUSTOMER_DELETED":
                handleCustomerDeleted(event);
                break;
            default:
                // Log unknown event type
                break;
        }
    }
    
    private void handleCustomerCreated(CustomerEvent event) {
        // Handle customer created event
        // e.g., send welcome email, create billing account
    }
    
    private void handleCustomerUpdated(CustomerEvent event) {
        // Handle customer updated event
        // e.g., update related systems
    }
    
    private void handleCustomerDeleted(CustomerEvent event) {
        // Handle customer deleted event
        // e.g., cleanup related data
    }
}
```

## 🌐 **Step 4: API Gateway Configuration**

### **Kong Configuration**
```yaml
# kong.yml
_format_version: "2.1"
_transform: true

services:
  - name: customer-service
    url: http://customer-service:8081
    routes:
      - name: customer-routes
        paths:
          - /api/v1/customers
        methods:
          - GET
          - POST
          - PUT
          - DELETE
        plugins:
          - name: rate-limiting
            config:
              minute: 100
              hour: 1000
          - name: key-auth
            config:
              key_names: ["apikey"]
              hide_credentials: true
          - name: cors
            config:
              origins: ["*"]
              methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
              headers: ["Content-Type", "Authorization"]
  
  - name: product-service
    url: http://product-service:8082
    routes:
      - name: product-routes
        paths:
          - /api/v1/products
          - /api/v1/catalog
        methods:
          - GET
          - POST
          - PUT
          - DELETE
        plugins:
          - name: rate-limiting
            config:
              minute: 200
              hour: 2000
          - name: key-auth
            config:
              key_names: ["apikey"]
              hide_credentials: true
  
  - name: order-service
    url: http://order-service:8083
    routes:
      - name: order-routes
        paths:
          - /api/v1/orders
        methods:
          - GET
          - POST
          - PUT
          - DELETE
        plugins:
          - name: rate-limiting
            config:
              minute: 150
              hour: 1500
          - name: key-auth
            config:
              key_names: ["apikey"]
              hide_credentials: true
  
  - name: billing-service
    url: http://billing-service:8084
    routes:
      - name: billing-routes
        paths:
          - /api/v1/billing
          - /api/v1/invoices
        methods:
          - GET
          - POST
          - PUT
          - DELETE
        plugins:
          - name: rate-limiting
            config:
              minute: 100
              hour: 1000
          - name: key-auth
            config:
              key_names: ["apikey"]
              hide_credentials: true

consumers:
  - username: bss-client
    keyauth_credentials:
      - key: "bss-api-key-12345"
```

## 🚀 **Step 5: Frontend Implementation**

### **Customer Portal (React)**
```jsx
// frontend/customer-portal/src/components/CustomerProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerProfile = ({ customerId }) => {
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [billing, setBilling] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomerData();
    }, [customerId]);

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            
            // Fetch customer profile
            const customerResponse = await axios.get(
                `/api/v1/customers/${customerId}`,
                { headers: { 'apikey': process.env.REACT_APP_API_KEY } }
            );
            
            // Fetch customer orders
            const ordersResponse = await axios.get(
                `/api/v1/orders?customerId=${customerId}`,
                { headers: { 'apikey': process.env.REACT_APP_API_KEY } }
            );
            
            // Fetch billing information
            const billingResponse = await axios.get(
                `/api/v1/billing/accounts/${customerId}`,
                { headers: { 'apikey': process.env.REACT_APP_API_KEY } }
            );
            
            setCustomer(customerResponse.data);
            setOrders(ordersResponse.data);
            setBilling(billingResponse.data);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!customer) return <div>Customer not found</div>;

    return (
        <div className="customer-profile">
            <div className="profile-header">
                <h1>{customer.firstName} {customer.lastName}</h1>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
                <p>Status: {customer.status}</p>
            </div>
            
            <div className="profile-sections">
                <div className="orders-section">
                    <h2>Orders ({orders.length})</h2>
                    {orders.map(order => (
                        <div key={order.id} className="order-item">
                            <h3>Order #{order.orderNumber}</h3>
                            <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p>Status: {order.status}</p>
                            <p>Total: ${order.totalAmount}</p>
                        </div>
                    ))}
                </div>
                
                <div className="billing-section">
                    <h2>Billing Information</h2>
                    {billing && (
                        <div>
                            <p>Account: {billing.accountNumber}</p>
                            <p>Status: {billing.status}</p>
                            <p>Balance: ${billing.currentBalance}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
```

## 📊 **Step 6: Testing and Validation**

### **Unit Tests**
```java
// customer-service/src/test/java/com/bss/customer/service/CustomerServiceTest.java
package com.bss.customer.service;

import com.bss.customer.dto.CreateCustomerRequest;
import com.bss.customer.dto.CustomerResponse;
import com.bss.customer.entity.Customer;
import com.bss.customer.repository.CustomerRepository;
import com.bss.customer.event.CustomerEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CustomerServiceTest {
    
    @Mock
    private CustomerRepository customerRepository;
    
    @Mock
    private CustomerEventPublisher eventPublisher;
    
    @InjectMocks
    private CustomerService customerService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void createCustomer_Success() {
        // Arrange
        CreateCustomerRequest request = CreateCustomerRequest.builder()
            .firstName("John")
            .lastName("Doe")
            .email("john.doe@example.com")
            .phone("+1234567890")
            .customerType("INDIVIDUAL")
            .build();
        
        Customer customer = Customer.builder()
            .id(1L)
            .firstName("John")
            .lastName("Doe")
            .email("john.doe@example.com")
            .phone("+1234567890")
            .customerType("INDIVIDUAL")
            .status("ACTIVE")
            .build();
        
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        
        // Act
        CustomerResponse result = customerService.createCustomer(request);
        
        // Assert
        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
        assertEquals("john.doe@example.com", result.getEmail());
        assertEquals("ACTIVE", result.getStatus());
        
        verify(customerRepository).save(any(Customer.class));
        verify(eventPublisher).publishCustomerCreated(any(Customer.class));
    }
    
    @Test
    void createCustomer_InvalidEmail_ThrowsException() {
        // Arrange
        CreateCustomerRequest request = CreateCustomerRequest.builder()
            .firstName("John")
            .lastName("Doe")
            .email("")
            .customerType("INDIVIDUAL")
            .build();
        
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            customerService.createCustomer(request);
        });
        
        verify(customerRepository, never()).save(any(Customer.class));
        verify(eventPublisher, never()).publishCustomerCreated(any(Customer.class));
    }
}
```

### **Integration Tests**
```java
// customer-service/src/test/java/com/bss/customer/integration/CustomerIntegrationTest.java
package com.bss.customer.integration;

import com.bss.customer.dto.CreateCustomerRequest;
import com.bss.customer.dto.CustomerResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase
@ActiveProfiles("test")
@Transactional
class CustomerIntegrationTest {
    
    @Autowired
    private WebApplicationContext webApplicationContext;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private MockMvc mockMvc;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }
    
    @Test
    void createCustomer_Success() throws Exception {
        // Arrange
        CreateCustomerRequest request = CreateCustomerRequest.builder()
            .firstName("John")
            .lastName("Doe")
            .email("john.doe@example.com")
            .phone("+1234567890")
            .customerType("INDIVIDUAL")
            .build();
        
        // Act & Assert
        mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john.doe@example.com"))
            .andExpect(jsonPath("$.status").value("ACTIVE"));
    }
    
    @Test
    void getCustomer_Success() throws Exception {
        // First create a customer
        CreateCustomerRequest createRequest = CreateCustomerRequest.builder()
            .firstName("Jane")
            .lastName("Smith")
            .email("jane.smith@example.com")
            .customerType("INDIVIDUAL")
            .build();
        
        String createResponse = mockMvc.perform(post("/api/v1/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andReturn()
            .getResponse()
            .getContentAsString();
        
        CustomerResponse customer = objectMapper.readValue(createResponse, CustomerResponse.class);
        
        // Then retrieve the customer
        mockMvc.perform(get("/api/v1/customers/" + customer.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Jane"))
            .andExpect(jsonPath("$.lastName").value("Smith"));
    }
}
```

## 🔒 **Step 7: Security Implementation**

### **JWT Authentication**
```java
// shared/src/main/java/com/bss/shared/security/JwtTokenProvider.java
package com.bss.shared.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration}")
    private int jwtExpirationInMs;
    
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
        
        return Jwts.builder()
            .setSubject(Long.toString(userPrincipal.getId()))
            .setIssuedAt(new Date())
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();
        
        return Long.parseLong(claims.getSubject());
    }
    
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            // Invalid JWT signature
            return false;
        } catch (MalformedJwtException ex) {
            // Invalid JWT token
            return false;
        } catch (ExpiredJwtException ex) {
            // Expired JWT token
            return false;
        } catch (UnsupportedJwtException ex) {
            // Unsupported JWT token
            return false;
        } catch (IllegalArgumentException ex) {
            // JWT claims string is empty
            return false;
        }
    }
}
```

## 📈 **Step 8: Monitoring and Observability**

### **Health Checks**
```java
// customer-service/src/main/java/com/bss/customer/health/CustomerHealthIndicator.java
package com.bss.customer.health;

import com.bss.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class CustomerHealthIndicator implements HealthIndicator {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Override
    public Health health() {
        try {
            long customerCount = customerRepository.count();
            return Health.up()
                .withDetail("customerCount", customerCount)
                .withDetail("status", "Customer service is running")
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}
```

### **Metrics Collection**
```java
// customer-service/src/main/java/com/bss/customer/metrics/CustomerMetrics.java
package com.bss.customer.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class CustomerMetrics {
    
    private final Counter customerCreatedCounter;
    private final Counter customerUpdatedCounter;
    private final Counter customerDeletedCounter;
    
    public CustomerMetrics(MeterRegistry meterRegistry) {
        this.customerCreatedCounter = Counter.builder("bss.customers.created")
            .description("Number of customers created")
            .register(meterRegistry);
        
        this.customerUpdatedCounter = Counter.builder("bss.customers.updated")
            .description("Number of customers updated")
            .register(meterRegistry);
        
        this.customerDeletedCounter = Counter.builder("bss.customers.deleted")
            .description("Number of customers deleted")
            .register(meterRegistry);
    }
    
    public void incrementCustomerCreated() {
        customerCreatedCounter.increment();
    }
    
    public void incrementCustomerUpdated() {
        customerUpdatedCounter.increment();
    }
    
    public void incrementCustomerDeleted() {
        customerDeletedCounter.increment();
    }
}
```

## 🚀 **Step 9: Deployment and DevOps**

### **Dockerfile**
```dockerfile
# customer-service/Dockerfile
FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/customer-service-1.0.0.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### **Kubernetes Deployment**
```yaml
# infrastructure/kubernetes/customer-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: customer-service
  labels:
    app: customer-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: customer-service
  template:
    metadata:
      labels:
        app: customer-service
    spec:
      containers:
      - name: customer-service
        image: bss/customer-service:1.0.0
        ports:
        - containerPort: 8081
        env:
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:postgresql://postgres-service:5432/customer_db"
        - name: SPRING_REDIS_HOST
          value: "redis-service"
        - name: SPRING_KAFKA_BOOTSTRAP_SERVERS
          value: "kafka-service:9092"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8081
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: customer-service
spec:
  selector:
    app: customer-service
  ports:
  - port: 8081
    targetPort: 8081
  type: ClusterIP
```

## 📋 **Implementation Checklist**

### **Phase 1: Foundation (Week 1-2)**
- [ ] Set up development environment
- [ ] Configure Docker and Docker Compose
- [ ] Set up PostgreSQL and Redis
- [ ] Configure Apache Kafka
- [ ] Set up API Gateway (Kong)

### **Phase 2: Core Services (Week 3-6)**
- [ ] Implement Customer Service
- [ ] Implement Product Service
- [ ] Implement Order Service
- [ ] Implement Billing Service
- [ ] Set up event-driven communication

### **Phase 3: Integration (Week 7-8)**
- [ ] Configure API Gateway
- [ ] Implement service discovery
- [ ] Set up load balancing
- [ ] Configure rate limiting
- [ ] Implement authentication and authorization

### **Phase 4: Frontend (Week 9-10)**
- [ ] Build Customer Portal
- [ ] Build Agent Desktop
- [ ] Build Mobile App
- [ ] Implement responsive design
- [ ] Add user experience features

### **Phase 5: Testing and Quality (Week 11-12)**
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Perform load testing
- [ ] Security testing
- [ ] User acceptance testing

### **Phase 6: Deployment (Week 13-14)**
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring and alerting
- [ ] Set up logging and tracing
- [ ] Deploy to staging environment
- [ ] Deploy to production environment

---

*This implementation guide provides a step-by-step approach to building a complete BSS system. Follow the phases sequentially and ensure each component is thoroughly tested before moving to the next phase.* 