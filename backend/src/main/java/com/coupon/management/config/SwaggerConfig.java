package com.coupon.management.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI couponManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Coupon Management System API")
                        .description("API for Coupon and Discount Management System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Coupon Management Team")
                                .email("support@couponmanagement.com")))
                .servers(List.of(
                        new Server()
                                .url("https://coupon-and-discount-management-system.onrender.com")
                                .description("Production Server"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .bearerFormat("JWT")
                                        .scheme("bearer")
                        ));
    }
}
